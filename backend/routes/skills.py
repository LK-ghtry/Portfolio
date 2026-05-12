from flask import Blueprint, jsonify
from models import Skill, Certification

skills_bp = Blueprint("skills", __name__)


@skills_bp.route("/skills")
def get_skills():
    skills = Skill.query.order_by(Skill.sort_order).all()
    return jsonify([{
        "id": s.id,
        "name": s.name,
        "category": s.category,
        "is_marquee": s.is_marquee,
        "sort_order": s.sort_order,
    } for s in skills])


@skills_bp.route("/certifications")
def get_certifications():
    certs = Certification.query.order_by(Certification.sort_order).all()
    return jsonify([{
        "id": c.id,
        "title": c.title,
        "issuer": c.issuer,
        "date": c.date,
        "icon": c.icon,
        "url": c.url,
        "sort_order": c.sort_order,
    } for c in certs])
