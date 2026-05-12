from flask import Blueprint, jsonify
from models import PersonalInfo

personal_bp = Blueprint("personal", __name__)


@personal_bp.route("/personal")
def get_personal():
    info = PersonalInfo.query.first()
    if not info:
        return jsonify(None)
    return jsonify({
        "id": info.id,
        "name_cn": info.name_cn,
        "name_en": info.name_en,
        "title": info.title,
        "subtitle": info.subtitle,
        "location": info.location,
        "email": info.email,
        "phone": info.phone,
        "bio": info.bio,
        "avatar_path": info.avatar_path,
        "resume_path": info.resume_path,
        "career_goal": info.career_goal,
        "github_url": info.github_url,
        "linkedin_url": info.linkedin_url,
        "twitter_url": info.twitter_url,
        "wechat_qr_path": info.wechat_qr_path,
    })
