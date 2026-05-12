from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from models import db, PersonalInfo, TimelineItem, Project, Competition, Skill, Certification, Interest, TravelPhoto, Playlist, GuestbookMessage, AdminUser, Writing
from datetime import timedelta

admin_bp = Blueprint("admin", __name__)


# ── Auth ──
@admin_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    user = AdminUser.query.filter_by(username=data.get("username")).first()
    if not user or not check_password_hash(user.password_hash, data.get("password", "")):
        return jsonify({"error": "用户名或密码错误"}), 401
    token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
    return jsonify({"token": token, "username": user.username})


@admin_bp.route("/auth/verify")
@jwt_required()
def verify():
    return jsonify({"valid": True})


# ── Personal Info ──
@admin_bp.route("/personal", methods=["PUT"])
@jwt_required()
def update_personal():
    data = request.get_json()
    info = PersonalInfo.query.first()
    if not info:
        info = PersonalInfo(id=1)
        db.session.add(info)
    for field in ["name_cn", "name_en", "title", "subtitle", "location", "email",
                   "phone", "bio", "avatar_path", "resume_path", "career_goal",
                   "github_url", "linkedin_url", "twitter_url", "wechat_qr_path"]:
        if field in data:
            setattr(info, field, data[field])
    db.session.commit()
    return jsonify({"message": "更新成功"})


# ── Generic CRUD helper ──
def crud_routes(bp, model, prefix, serialize_fn, create_required_fields):
    """Register standard CRUD endpoints for a model on the given blueprint."""
    # Use unique endpoint names to avoid collisions
    ep = prefix.replace("-", "_")

    @bp.route(f"/{prefix}", methods=["POST"], endpoint=f"create_{ep}")
    @jwt_required()
    def create():
        data = request.get_json()
        for f in create_required_fields:
            if f not in data or not data[f]:
                return jsonify({"error": f"{f} is required"}), 400
        item = model()
        for k, v in data.items():
            if hasattr(item, k):
                setattr(item, k, v)
        db.session.add(item)
        db.session.commit()
        return jsonify(serialize_fn(item)), 201

    @bp.route(f"/{prefix}/<int:item_id>", methods=["PUT"], endpoint=f"update_{ep}")
    @jwt_required()
    def update(item_id):
        item = model.query.get_or_404(item_id)
        data = request.get_json()
        for k, v in data.items():
            if hasattr(item, k) and k != "id":
                setattr(item, k, v)
        db.session.commit()
        return jsonify(serialize_fn(item))

    @bp.route(f"/{prefix}/<int:item_id>", methods=["DELETE"], endpoint=f"delete_{ep}")
    @jwt_required()
    def delete(item_id):
        item = model.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "删除成功"})

    @bp.route(f"/{prefix}/reorder", methods=["PUT"], endpoint=f"reorder_{ep}")
    @jwt_required()
    def reorder():
        data = request.get_json()
        if not data or "ids" not in data:
            return jsonify({"error": "ids array required"}), 400
        for order, item_id in enumerate(reversed(data["ids"])):
            item = model.query.get(item_id)
            if item:
                item.sort_order = order
        db.session.commit()
        return jsonify({"message": "排序更新成功"})

    return create, update, delete, reorder


# Serializers
def _serialize_timeline(item):
    return {"id": item.id, "category": item.category, "title": item.title,
            "subtitle": item.subtitle, "description": item.description,
            "start_date": item.start_date, "end_date": item.end_date,
            "sort_order": item.sort_order, "is_current": item.is_current,
            "badge_text": item.badge_text}

def _serialize_project(item):
    return {"id": item.id, "title": item.title, "category": item.category,
            "short_description": item.short_description, "full_description": item.full_description,
            "image_path": item.image_path, "github_url": item.github_url,
            "live_url": item.live_url, "sort_order": item.sort_order, "featured": item.featured}

def _serialize_competition(item):
    return {"id": item.id, "title": item.title, "award": item.award,
            "date": item.date, "icon": item.icon, "sort_order": item.sort_order}

def _serialize_skill(item):
    return {"id": item.id, "name": item.name, "category": item.category,
            "is_marquee": item.is_marquee, "sort_order": item.sort_order}

def _serialize_cert(item):
    return {"id": item.id, "title": item.title, "issuer": item.issuer,
            "date": item.date, "icon": item.icon, "url": item.url, "sort_order": item.sort_order}

def _serialize_interest(item):
    return {"id": item.id, "title": item.title, "description": item.description,
            "icon_name": item.icon_name, "icon_color": item.icon_color,
            "link_url": item.link_url, "link_text": item.link_text, "sort_order": item.sort_order}

def _serialize_travel(item):
    return {"id": item.id, "country": item.country, "image_path": item.image_path,
            "caption": item.caption, "sort_order": item.sort_order}

def _serialize_playlist(item):
    return {"id": item.id, "title": item.title, "platform": item.platform,
            "link_url": item.link_url, "sort_order": item.sort_order}

def _serialize_writing(item):
    return {"id": item.id, "title": item.title, "url": item.url,
            "description": item.description, "platform": item.platform,
            "sort_order": item.sort_order}


# Register CRUD routes
crud_routes(admin_bp, TimelineItem, "timeline", _serialize_timeline, ["title", "category"])
crud_routes(admin_bp, Project, "projects", _serialize_project, ["title", "category"])
crud_routes(admin_bp, Competition, "competitions", _serialize_competition, ["title"])
crud_routes(admin_bp, Skill, "skills", _serialize_skill, ["name"])
crud_routes(admin_bp, Certification, "certifications", _serialize_cert, ["title"])
crud_routes(admin_bp, Interest, "interests", _serialize_interest, ["title"])
crud_routes(admin_bp, TravelPhoto, "travel-photos", _serialize_travel, ["country", "image_path"])
crud_routes(admin_bp, Playlist, "playlists", _serialize_playlist, ["title"])
crud_routes(admin_bp, Writing, "writings", _serialize_writing, ["title", "url"])


# ── Guestbook Moderation ──
@admin_bp.route("/guestbook")
@jwt_required()
def admin_get_guestbook():
    messages = GuestbookMessage.query.order_by(GuestbookMessage.created_at.desc()).all()
    return jsonify([{
        "id": m.id, "author_name": m.author_name, "message": m.message,
        "is_approved": m.is_approved, "is_pinned": m.is_pinned,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m in messages])


@admin_bp.route("/guestbook/<int:msg_id>", methods=["PUT"])
@jwt_required()
def admin_update_guestbook(msg_id):
    msg = GuestbookMessage.query.get_or_404(msg_id)
    data = request.get_json()
    if "is_approved" in data:
        msg.is_approved = data["is_approved"]
    if "is_pinned" in data:
        # Unpin all others if pinning this one
        if data["is_pinned"]:
            GuestbookMessage.query.update({"is_pinned": False})
        msg.is_pinned = data["is_pinned"]
    db.session.commit()
    return jsonify({"message": "更新成功"})


@admin_bp.route("/guestbook/<int:msg_id>", methods=["DELETE"])
@jwt_required()
def admin_delete_guestbook(msg_id):
    msg = GuestbookMessage.query.get_or_404(msg_id)
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"message": "删除成功"})


# ── Dashboard Stats ──
@admin_bp.route("/stats")
@jwt_required()
def get_stats():
    return jsonify({
        "pending_messages": GuestbookMessage.query.filter_by(is_approved=False).count(),
        "total_projects": Project.query.count(),
        "total_timeline": TimelineItem.query.count(),
        "total_skills": Skill.query.count(),
        "total_interests": Interest.query.count(),
    })
