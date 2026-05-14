from flask import Blueprint, jsonify
from models import TimelineItem

timeline_bp = Blueprint("timeline", __name__)


def serialize_item(item):
    return {
        "id": item.id,
        "category": item.category,
        "title": item.title,
        "subtitle": item.subtitle,
        "description": item.description,
        "start_date": item.start_date,
        "end_date": item.end_date,
        "sort_order": item.sort_order,
        "is_current": item.is_current,
        "badge_text": item.badge_text,
        "link_url": item.link_url,
        "link_text": item.link_text,
    }


@timeline_bp.route("/timeline")
def get_timeline():
    items = TimelineItem.query.order_by(TimelineItem.sort_order.desc()).all()
    return jsonify([serialize_item(item) for item in items])
