from flask import Blueprint, jsonify, request
from models import db, GuestbookMessage

guestbook_bp = Blueprint("guestbook", __name__)


@guestbook_bp.route("/guestbook")
def get_guestbook():
    messages = GuestbookMessage.query.filter_by(is_approved=True) \
        .order_by(GuestbookMessage.created_at.desc()).all()
    return jsonify([{
        "id": m.id,
        "author_name": m.author_name,
        "message": m.message,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m in messages])


@guestbook_bp.route("/guestbook", methods=["POST"])
def post_guestbook():
    data = request.get_json()
    if not data or not data.get("message"):
        return jsonify({"error": "Message is required"}), 400
    msg = GuestbookMessage(
        author_name=data.get("author_name", "匿名"),
        message=data["message"],
        is_approved=False,
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": "留言已提交，审核后将显示"}), 201


@guestbook_bp.route("/guestbook/pinned")
def get_pinned_message():
    msg = GuestbookMessage.query.filter_by(is_approved=True, is_pinned=True).first()
    if not msg:
        return jsonify(None)
    return jsonify({
        "id": msg.id,
        "author_name": msg.author_name,
        "message": msg.message,
    })
