from flask import Blueprint, jsonify, request
from models import Interest, TravelPhoto, Playlist, Writing

interests_bp = Blueprint("interests", __name__)


@interests_bp.route("/interests")
def get_interests():
    items = Interest.query.order_by(Interest.sort_order).all()
    return jsonify([{
        "id": i.id,
        "title": i.title,
        "description": i.description,
        "icon_name": i.icon_name,
        "icon_color": i.icon_color,
        "link_url": i.link_url,
        "link_text": i.link_text,
        "sort_order": i.sort_order,
    } for i in items])


@interests_bp.route("/travel-photos")
def get_travel_photos():
    country = request.args.get("country")
    query = TravelPhoto.query
    if country:
        query = query.filter_by(country=country)
    photos = query.order_by(TravelPhoto.sort_order).all()
    return jsonify([{
        "id": p.id,
        "country": p.country,
        "image_path": p.image_path,
        "caption": p.caption,
        "sort_order": p.sort_order,
    } for p in photos])


@interests_bp.route("/travel-countries")
def get_travel_countries():
    rows = TravelPhoto.query.with_entities(TravelPhoto.country).distinct().all()
    return jsonify(sorted([r[0] for r in rows]))


@interests_bp.route("/playlists")
def get_playlists():
    items = Playlist.query.order_by(Playlist.sort_order).all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "platform": p.platform,
        "link_url": p.link_url,
        "sort_order": p.sort_order,
    } for p in items])


@interests_bp.route("/writings")
def get_writings():
    items = Writing.query.order_by(Writing.sort_order.desc()).all()
    return jsonify([{
        "id": w.id,
        "title": w.title,
        "url": w.url,
        "description": w.description,
        "platform": w.platform,
        "sort_order": w.sort_order,
    } for w in items])
