"""Export SQLite data to frontend/public/data.json for GitHub Pages deployment."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from models import (
    PersonalInfo, TimelineItem, Project, Competition,
    Skill, Certification, Interest, TravelPhoto,
    Playlist, GuestbookMessage, Writing, VibeProject,
)

app = create_app()

with app.app_context():
    data = {}

    # Personal info
    pi = PersonalInfo.query.first()
    if pi:
        data["personal"] = {
            "name_cn": pi.name_cn, "name_en": pi.name_en,
            "title": pi.title, "subtitle": pi.subtitle,
            "location": pi.location, "email": pi.email,
            "phone": pi.phone, "bio": pi.bio,
            "avatar_path": pi.avatar_path, "resume_path": pi.resume_path,
            "career_goal": pi.career_goal,
            "github_url": pi.github_url, "linkedin_url": pi.linkedin_url,
            "twitter_url": pi.twitter_url, "wechat_qr_path": pi.wechat_qr_path,
        }

    # Timeline
    data["timeline"] = [{
        "id": t.id, "category": t.category, "title": t.title,
        "subtitle": t.subtitle, "description": t.description,
        "start_date": t.start_date, "end_date": t.end_date,
        "sort_order": t.sort_order, "is_current": t.is_current,
        "badge_text": t.badge_text, "link_url": t.link_url,
        "link_text": t.link_text,
    } for t in TimelineItem.query.order_by(TimelineItem.sort_order.desc()).all()]

    # Projects
    data["projects"] = [{
        "id": p.id, "title": p.title, "category": p.category,
        "short_description": p.short_description, "full_description": p.full_description,
        "image_path": p.image_path, "github_url": p.github_url,
        "live_url": p.live_url, "sort_order": p.sort_order, "featured": p.featured,
    } for p in Project.query.order_by(Project.sort_order.desc()).all()]

    # Competitions
    data["competitions"] = [{
        "id": c.id, "title": c.title, "award": c.award,
        "date": c.date, "icon": c.icon, "sort_order": c.sort_order,
    } for c in Competition.query.order_by(Competition.sort_order.desc()).all()]

    # Skills
    data["skills"] = [{
        "id": s.id, "name": s.name, "category": s.category,
        "is_marquee": s.is_marquee, "sort_order": s.sort_order,
    } for s in Skill.query.order_by(Skill.sort_order.desc()).all()]

    # Certifications
    data["certifications"] = [{
        "id": c.id, "title": c.title, "issuer": c.issuer,
        "date": c.date, "icon": c.icon, "url": c.url, "sort_order": c.sort_order,
    } for c in Certification.query.order_by(Certification.sort_order.desc()).all()]

    # Interests
    data["interests"] = [{
        "id": i.id, "title": i.title, "description": i.description,
        "icon_name": i.icon_name, "icon_color": i.icon_color,
        "link_url": i.link_url, "link_text": i.link_text, "sort_order": i.sort_order,
    } for i in Interest.query.order_by(Interest.sort_order.desc()).all()]

    # Travel photos
    data["travel-photos"] = [{
        "id": t.id, "country": t.country, "image_path": t.image_path,
        "caption": t.caption, "sort_order": t.sort_order,
    } for t in TravelPhoto.query.order_by(TravelPhoto.sort_order.desc()).all()]

    travel_countries = set()
    for t in TravelPhoto.query.all():
        if t.country:
            travel_countries.add(t.country)
    data["travel-countries"] = sorted(travel_countries)

    # Playlists
    data["playlists"] = [{
        "id": p.id, "title": p.title, "platform": p.platform,
        "link_url": p.link_url, "sort_order": p.sort_order,
    } for p in Playlist.query.order_by(Playlist.sort_order.desc()).all()]

    # Guestbook (approved only)
    data["guestbook"] = [{
        "id": m.id, "author_name": m.author_name, "message": m.message,
        "is_approved": m.is_approved, "is_pinned": m.is_pinned,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    } for m in GuestbookMessage.query.filter_by(is_approved=True).order_by(GuestbookMessage.created_at.desc()).all()]

    # Writings
    data["writings"] = [{
        "id": w.id, "title": w.title, "url": w.url,
        "description": w.description, "platform": w.platform, "sort_order": w.sort_order,
    } for w in Writing.query.order_by(Writing.sort_order.desc()).all()]

    # Vibe Projects
    data["vibe-projects"] = [{
        "id": v.id, "title": v.title, "description": v.description,
        "icon": v.icon, "url": v.url, "sort_order": v.sort_order,
    } for v in VibeProject.query.order_by(VibeProject.sort_order.desc()).all()]

    # Project categories
    categories = set()
    for p in Project.query.all():
        if p.category:
            categories.add(p.category)
    data["project-categories"] = sorted(categories)

    # Write to frontend/public/data.json
    output_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Exported {len(data)} data keys to {output_path}")
    for k, v in data.items():
        if isinstance(v, list):
            print(f"  {k}: {len(v)} items")
        else:
            print(f"  {k}: 1 item")
