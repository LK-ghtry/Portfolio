from flask import Blueprint, jsonify, request
from models import Project, Competition

projects_bp = Blueprint("projects", __name__)


@projects_bp.route("/projects")
def get_projects():
    category = request.args.get("category")
    query = Project.query
    if category:
        query = query.filter_by(category=category)
    projects = query.order_by(Project.sort_order.desc()).all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "short_description": p.short_description,
        "full_description": p.full_description,
        "image_path": p.image_path,
        "github_url": p.github_url,
        "live_url": p.live_url,
        "sort_order": p.sort_order,
        "featured": p.featured,
    } for p in projects])


@projects_bp.route("/competitions")
def get_competitions():
    competitions = Competition.query.order_by(Competition.sort_order.desc()).all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "award": c.award,
        "date": c.date,
        "icon": c.icon,
        "sort_order": c.sort_order,
    } for c in competitions])


@projects_bp.route("/project-categories")
def get_project_categories():
    rows = Project.query.with_entities(Project.category).distinct().all()
    return jsonify([r[0] for r in rows])
