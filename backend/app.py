from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

jwt = JWTManager()


def create_app():
    app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()
        from seed import seed_if_empty
        seed_if_empty()

    # Register public routes
    from routes.personal import personal_bp
    from routes.timeline import timeline_bp
    from routes.projects import projects_bp
    from routes.skills import skills_bp
    from routes.interests import interests_bp
    from routes.guestbook import guestbook_bp
    from routes.upload import upload_bp

    app.register_blueprint(personal_bp, url_prefix="/api")
    app.register_blueprint(timeline_bp, url_prefix="/api")
    app.register_blueprint(projects_bp, url_prefix="/api")
    app.register_blueprint(skills_bp, url_prefix="/api")
    app.register_blueprint(interests_bp, url_prefix="/api")
    app.register_blueprint(guestbook_bp, url_prefix="/api")
    app.register_blueprint(upload_bp, url_prefix="/api")

    # Admin routes
    from routes.admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Serve uploads
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Serve frontend SPA
    @app.route("/")
    @app.route("/<path:path>")
    def serve_frontend(path=""):
        from flask import request
        import os
        dist_path = os.path.join(app.static_folder, "index.html")
        if os.path.exists(dist_path):
            return send_from_directory(app.static_folder, "index.html")
        return {"message": "Frontend not built yet. Run `npm run build` in frontend/"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
