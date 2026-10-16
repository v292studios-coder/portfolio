import os
import base64
import io
import subprocess
from PIL import Image

def get_base64_image(image_path, max_dimension=1600, quality=85):
    """Load, optionally resize and compress image to base64 jpeg/png string."""
    if not os.path.exists(image_path):
        print(f"Warning: {image_path} not found")
        return ""
    
    with Image.open(image_path) as img:
        # Convert to RGB and copy pixel data to a clean image to strip bloated XMP/metadata
        rgb = img.convert("RGB")
        w, h = rgb.size
        if max(w, h) > max_dimension:
            scale = max_dimension / max(w, h)
            new_size = (int(w * scale), int(h * scale))
            rgb = rgb.resize(new_size, Image.Resampling.LANCZOS)
            
        clean_img = Image.new("RGB", rgb.size)
        clean_img.paste(rgb)
            
        buffer = io.BytesIO()
        clean_img.save(buffer, format="JPEG", quality=quality, optimize=True)
        mime = "image/jpeg"
            
        b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:{mime};base64,{b64}"

def build_portfolio():
    print("Preparing images for 292 Studios Portfolio PDF...")
    
    # Selected best works across all categories
    img_map = {
        # About / Profile (New Headshot)
        "about": get_base64_image("images/Photos/headshots/Vishnu/cover-DSC08731-Edit.jpg", 1200),
        
        # Studio - Vishnu Roses
        "roses_hero": get_base64_image("images/Photos/Studio/Vishnu Roses Photoshoot/cover-DSC08516-Edit.jpg", 1600),
        "roses_1": get_base64_image("images/Photos/Studio/Vishnu Roses Photoshoot/DSC08553-Edit-2-Edit-Edit.jpg", 1200),
        "roses_2": get_base64_image("images/Photos/Studio/Vishnu Roses Photoshoot/DSC08606-Edit-Edit-2.jpg", 1200),
        
        # Studio - Ebonie & Rose
        "ebonie_hero": get_base64_image("images/Photos/Studio/Ebonie Shoot/cover-IMG_6931-Edit.png", 1600),
        "ebonie_detail": get_base64_image("images/Photos/Studio/Ebonie Shoot/IMG_6842-Edit.png", 1200),
        "rose_blue": get_base64_image("images/Photos/Studio/Rose 21st Birthday Shoot/DSC02222-Edit.jpg", 1400),
        "rose_action": get_base64_image("images/Photos/Studio/Rose 21st Birthday Shoot/DSC02383-Edit.jpg", 1200),
        
        # Studio - Santos & Jon (Movement & High Contrast)
        "santos_hero": get_base64_image("images/Photos/Studio/Santos Shoot 1/IMG_6250-Edit.jpg", 1600),
        "santos_jump": get_base64_image("images/Photos/Studio/Santos Shoot 2/IMG_6415-Edit.jpg", 1200),
        "jon_noir": get_base64_image("images/Photos/Studio/Jon/cover-Edit-Ver-2 (4 of 6).jpg", 1400),
        "jay_bday": get_base64_image("images/Photos/Studio/Jay 20th Birthday Shoot/cover-IMG_5817-Edit.jpg", 1200),
        
        # Headshots & Personal Branding
        "headshot_beauty": get_base64_image("images/Photos/headshots/Beauty Test Shoot/cover-DSC02685-Edit.jpg", 1400),
        "headshot_beauty_2": get_base64_image("images/Photos/headshots/Beauty Test Shoot/DSC02627-Edit.jpg", 1200),
        "headshot_pat": get_base64_image("images/Photos/headshots/Pat/cover-DSC01291-Edit.png", 1200),
        "headshot_aldo": get_base64_image("images/Photos/headshots/Aldo/cover-IMG_5895-Edit.jpg", 1200),
        "headshot_vinay": get_base64_image("images/Photos/headshots/Vinay/cover-DSC07757.jpg", 1200),
        
        # Graduation - Jade
        "grad_hero": get_base64_image("images/Photos/Graduation/Jade/cover-IMG_7296-Edit.png", 1600),
        "grad_cap": get_base64_image("images/Photos/Graduation/Jade/IMG_7416-Edit.png", 1200),
        "grad_joy": get_base64_image("images/Photos/Graduation/Jade/IMG_7600-Edit-2.png", 1200),
        
        # Automotive
        "auto_hero": get_base64_image("images/Photos/Automotive/cover-DSC01618.jpg", 1800),
        "auto_lineup": get_base64_image("images/Photos/Automotive/DSC01875.jpg", 1800),
        "auto_detail": get_base64_image("images/Photos/Automotive/DSC01881.jpg", 1400),
    }

    print("Generating editorial HTML layout...")
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>292 STUDIOS - Photography Portfolio</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Inter:wght@300;400;500;600&display=swap');

    @page {{
        size: 11in 8.5in;
        margin: 0;
    }}

    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }}

    body {{
        background-color: #0b0b0c;
        color: #f0f0f3;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        letter-spacing: -0.01em;
    }}

    .page {{
        width: 11in;
        height: 8.5in;
        position: relative;
        page-break-after: always;
        overflow: hidden;
        background-color: #0b0b0c;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.65in 0.85in;
    }}

    /* Typography */
    h1, h2, h3, h4, .font-heading {{
        font-family: 'Montserrat', sans-serif;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 400;
    }}

    .gold {{
        color: #d4af37;
    }}
    .gold-accent {{
        color: #c9a96e;
    }}
    .text-muted {{
        color: #8c8c94;
    }}

    /* Running Header & Footer */
    .header-bar {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 0.25in;
        margin-bottom: 0.35in;
    }}
    .header-logo {{
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 3px;
        color: #fff;
    }}
    .header-category {{
        font-size: 10px;
        letter-spacing: 2.5px;
        color: #c9a96e;
        font-weight: 500;
        text-transform: uppercase;
    }}

    .footer-bar {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 0.2in;
        margin-top: 0.3in;
        font-size: 10px;
        letter-spacing: 1.5px;
        color: #72727a;
    }}

    /* Common Card / Frame */
    .img-box {{
        background: #141416;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }}
    .img-box img {{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }}

    /* ==========================================================
       PAGE 1: COVER
       ========================================================== */
    .cover-page {{
        padding: 0;
        background: radial-gradient(circle at 75% 40%, #1a1917 0%, #0b0b0c 70%);
        display: grid;
        grid-template-columns: 1.2fr 1fr;
    }}
    .cover-left {{
        padding: 1in 0.85in;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 2;
    }}
    .cover-tagline {{
        font-size: 11px;
        letter-spacing: 4px;
        color: #c9a96e;
        margin-bottom: 0.2in;
    }}
    .cover-title {{
        font-size: 54px;
        line-height: 1.05;
        font-weight: 300;
        letter-spacing: 6px;
        color: #ffffff;
        margin-bottom: 0.15in;
    }}
    .cover-byline {{
        font-size: 14px;
        letter-spacing: 3px;
        color: #a0a0a8;
        font-weight: 400;
        margin-bottom: 0.4in;
    }}
    .cover-desc {{
        max-width: 440px;
        color: #8c8c94;
        font-size: 13px;
        line-height: 1.8;
        font-weight: 300;
        border-left: 2px solid #c9a96e;
        padding-left: 16px;
    }}
    .cover-meta {{
        font-size: 11px;
        letter-spacing: 2px;
        color: #72727a;
        line-height: 1.8;
    }}
    .cover-right {{
        position: relative;
        overflow: hidden;
        height: 100%;
    }}
    .cover-right img {{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
    }}
    .cover-overlay {{
        position: absolute;
        inset: 0;
        background: linear-gradient(to right, #0b0b0c 0%, transparent 20%, transparent 80%, rgba(11,11,12,0.4) 100%);
    }}

    /* ==========================================================
       PAGE 2: ABOUT & ARTIST STATEMENT
       ========================================================== */
    .about-layout {{
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 0.7in;
        align-items: center;
        flex: 1;
    }}
    .about-text h2 {{
        font-size: 32px;
        font-weight: 300;
        letter-spacing: 4px;
        margin-bottom: 0.1in;
    }}
    .about-subtitle {{
        color: #c9a96e;
        font-size: 11px;
        letter-spacing: 3px;
        margin-bottom: 0.3in;
    }}
    .about-body {{
        color: #b0b0b8;
        font-size: 13px;
        line-height: 1.85;
        font-weight: 300;
        margin-bottom: 0.25in;
    }}
    .about-body strong {{
        color: #fff;
        font-weight: 500;
    }}
    .about-pillars {{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.2in;
        margin-top: 0.3in;
    }}
    .pillar-card {{
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        padding: 0.18in;
        border-radius: 4px;
    }}
    .pillar-title {{
        font-size: 11px;
        letter-spacing: 1.5px;
        color: #c9a96e;
        margin-bottom: 4px;
        font-weight: 500;
    }}
    .pillar-desc {{
        font-size: 11px;
        color: #8c8c94;
        line-height: 1.5;
    }}
    .about-photo-wrapper {{
        height: 5.6in;
        position: relative;
    }}

    /* ==========================================================
       PAGE 3 & 4 & 5: STUDIO EDITORIAL LAYOUTS
       ========================================================== */
    .studio-layout-1 {{
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: 0.5in;
        flex: 1;
        align-items: center;
    }}
    .studio-side-grid {{
        display: flex;
        flex-direction: column;
        gap: 0.35in;
        height: 100%;
        justify-content: center;
    }}
    .studio-meta-box {{
        padding: 0.2in 0;
        border-top: 1px solid rgba(255,255,255,0.08);
    }}
    .studio-meta-title {{
        font-size: 18px;
        letter-spacing: 2px;
        margin-bottom: 6px;
    }}
    .studio-meta-desc {{
        font-size: 12px;
        color: #8c8c94;
        line-height: 1.6;
        font-weight: 300;
    }}

    .studio-trio-layout {{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.35in;
        flex: 1;
        align-items: center;
    }}
    .trio-card {{
        display: flex;
        flex-direction: column;
        gap: 0.15in;
        height: 100%;
    }}
    .trio-card .img-box {{
        flex: 1;
        height: 4.8in;
    }}
    .trio-caption {{
        font-size: 11px;
        letter-spacing: 1.5px;
        color: #c9a96e;
        text-transform: uppercase;
    }}
    .trio-sub {{
        font-size: 11px;
        color: #72727a;
    }}

    /* ==========================================================
       PAGE 6: HEADSHOTS 4-UP GRID
       ========================================================== */
    .headshots-grid {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.3in;
        flex: 1;
        align-items: center;
    }}
    .headshot-card {{
        display: flex;
        flex-direction: column;
        gap: 0.15in;
        height: 100%;
    }}
    .headshot-card .img-box {{
        height: 4.9in;
    }}
    .headshot-name {{
        font-size: 12px;
        letter-spacing: 2px;
        font-weight: 500;
        color: #fff;
    }}
    .headshot-role {{
        font-size: 10px;
        color: #8c8c94;
        letter-spacing: 1px;
        text-transform: uppercase;
    }}

    /* ==========================================================
       PAGE 7: GRADUATION SPREAD
       ========================================================== */
    .grad-layout {{
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 0.5in;
        flex: 1;
        align-items: center;
    }}
    .grad-side {{
        display: flex;
        flex-direction: column;
        gap: 0.3in;
        height: 100%;
        justify-content: center;
    }}
    .grad-side-imgs {{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.25in;
        height: 3.4in;
    }}

    /* ==========================================================
       PAGE 8: AUTOMOTIVE CINEMATIC
       ========================================================== */
    .auto-layout {{
        display: grid;
        grid-template-rows: 1fr 0.7fr;
        gap: 0.35in;
        flex: 1;
    }}
    .auto-hero-box {{
        width: 100%;
        height: 100%;
    }}
    .auto-bottom-row {{
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 0.35in;
        align-items: center;
    }}
    .auto-details-text h3 {{
        font-size: 20px;
        letter-spacing: 3px;
        margin-bottom: 0.1in;
    }}
    .auto-details-text p {{
        font-size: 12px;
        color: #92929c;
        line-height: 1.7;
        font-weight: 300;
    }}

    /* ==========================================================
       PAGE 9: SERVICES & PRODUCTION STANDARDS
       ========================================================== */
    .services-grid {{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.35in;
        margin-bottom: 0.4in;
    }}
    .service-card {{
        background: #121214;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 6px;
        padding: 0.3in 0.25in;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }}
    .service-card.popular {{
        border-color: #c9a96e;
        position: relative;
    }}
    .badge-pop {{
        position: absolute;
        top: -10px;
        right: 18px;
        background: #c9a96e;
        color: #0b0b0c;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.5px;
        padding: 3px 8px;
        border-radius: 3px;
        text-transform: uppercase;
    }}
    .service-tier {{
        font-size: 13px;
        letter-spacing: 2px;
        color: #fff;
        margin-bottom: 8px;
    }}
    .service-price {{
        font-size: 28px;
        font-weight: 300;
        color: #c9a96e;
        margin-bottom: 0.2in;
    }}
    .service-features {{
        list-style: none;
        font-size: 11px;
        color: #a0a0a8;
        line-height: 1.8;
    }}
    .service-features li {{
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }}
    .service-features li::before {{
        content: "•";
        color: #c9a96e;
    }}

    .standards-bar {{
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 6px;
        padding: 0.25in;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.3in;
    }}
    .standard-col h4 {{
        font-size: 11px;
        color: #c9a96e;
        margin-bottom: 4px;
        letter-spacing: 1.5px;
    }}
    .standard-col p {{
        font-size: 11px;
        color: #8c8c94;
        line-height: 1.5;
    }}

    /* ==========================================================
       PAGE 10: BACK COVER / CONTACT
       ========================================================== */
    .back-cover {{
        padding: 1in;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: radial-gradient(circle at center, #181716 0%, #0b0b0c 80%);
    }}
    .back-logo {{
        font-size: 40px;
        letter-spacing: 8px;
        font-weight: 300;
        margin-bottom: 8px;
        color: #fff;
    }}
    .back-sub {{
        font-size: 13px;
        letter-spacing: 5px;
        color: #c9a96e;
        margin-bottom: 0.5in;
    }}
    .back-line {{
        width: 60px;
        height: 1px;
        background: #c9a96e;
        margin-bottom: 0.5in;
    }}
    .contact-grid {{
        display: flex;
        gap: 0.6in;
        margin-bottom: 0.6in;
    }}
    .contact-item {{
        display: flex;
        flex-direction: column;
        gap: 4px;
    }}
    .contact-label {{
        font-size: 10px;
        letter-spacing: 2px;
        color: #72727a;
        text-transform: uppercase;
    }}
    .contact-value {{
        font-size: 14px;
        color: #f0f0f3;
        letter-spacing: 1px;
    }}
    .back-footer-text {{
        font-size: 11px;
        color: #55555c;
        letter-spacing: 2px;
        text-transform: uppercase;
    }}
</style>
</head>
<body>

    <!-- =======================================================
         PAGE 1: COVER
         ======================================================= -->
    <div class="page cover-page">
        <div class="cover-left">
            <div>
                <p class="cover-tagline">COMMERCIAL & PORTRAIT PORTFOLIO</p>
                <h1 class="cover-title">292<br>STUDIOS</h1>
                <p class="cover-byline">BY VISHNU KUMAR</p>
                <p class="cover-desc">
                    A curated collection of studio portraiture, corporate headshots, creative movement, and commercial imagery captured with precision lighting and intentional storytelling.
                </p>
            </div>
            <div class="cover-meta">
                <p>SAYREVILLE, NEW JERSEY</p>
                <p>WWW.292STUDIOS.COM</p>
                <p>&copy; 2026 292 STUDIOS. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
        <div class="cover-right">
            <img src="{img_map['roses_hero']}" alt="Signature Studio Portrait">
            <div class="cover-overlay"></div>
        </div>
    </div>

    <!-- =======================================================
         PAGE 2: ABOUT THE ARTIST
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">ABOUT & ARTIST STATEMENT</span>
            <span class="header-category">02</span>
        </div>

        <div class="about-layout">
            <div class="about-text">
                <h2>VISHNU KUMAR</h2>
                <p class="about-subtitle">FOUNDER & LEAD PHOTOGRAPHER</p>
                <p class="about-body">
                    Based in Sayreville, New Jersey, I specialize in commercial studio portraiture, modern headshots, and creative storytelling. From an early passion for visual arts to producing high-impact campaigns, my approach centers on translating dynamic concepts into imagery that is not just seen, but felt.
                </p>
                <p class="about-body">
                    At <strong>292 STUDIOS</strong>, every shoot is guided by rigorous technical precision—sculpting light to flatter natural contours, ensuring exact color calibration, and capturing authentic human expression across artists, dancers, professionals, and automotive enthusiasts.
                </p>

                <div class="about-pillars">
                    <div class="pillar-card">
                        <h4 class="pillar-title">STUDIO LIGHTING</h4>
                        <p class="pillar-desc">Multi-point strobes, diffused modifiers, and shadow control tailored to skin and silhouette.</p>
                    </div>
                    <div class="pillar-card">
                        <h4 class="pillar-title">COLOR ACCURACY</h4>
                        <p class="pillar-desc">Strict color profiles and calibration for seamless digital, social, and print fidelity.</p>
                    </div>
                    <div class="pillar-card">
                        <h4 class="pillar-title">HIGH-END RETOUCHING</h4>
                        <p class="pillar-desc">Preserving authentic skin texture while removing distractions and balancing tones.</p>
                    </div>
                    <div class="pillar-card">
                        <h4 class="pillar-title">DIGITAL WORKFLOW</h4>
                        <p class="pillar-desc">Structured digital asset management (DAM) ensuring swift turnaround and asset security.</p>
                    </div>
                </div>
            </div>

            <div class="about-photo-wrapper img-box">
                <img src="{img_map['about']}" alt="Vishnu Kumar Portrait">
            </div>
        </div>

        <div class="footer-bar">
            <span>292 STUDIOS — SAYREVILLE, NJ</span>
            <span>PORTFOLIO LOOKBOOK</span>
            <span>292STUDIOS.COM</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 3: STUDIO PORTRAITURE - EDITORIAL NOIR & FLORAL
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">STUDIO PORTRAITURE — EDITORIAL NOIR</span>
            <span class="header-category">03</span>
        </div>

        <div class="studio-layout-1">
            <div class="img-box" style="height: 5.7in;">
                <img src="{img_map['roses_hero']}" alt="Roses Editorial Portrait">
            </div>
            <div class="studio-side-grid">
                <div class="img-box" style="height: 2.6in;">
                    <img src="{img_map['roses_1']}" alt="Detail Shot 1">
                </div>
                <div class="img-box" style="height: 2.6in;">
                    <img src="{img_map['roses_2']}" alt="Detail Shot 2">
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>PROJECT: VISHNU ROSES EDITORIAL</span>
            <span>LIGHTING: DUAL DIFFUSED STROBES & RIM ACCENTS</span>
            <span>POST: TEXTURE-PRESERVING COLOR GRADE</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 4: STUDIO PORTRAITURE - MOVEMENT & EXPRESSION
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">STUDIO PORTRAITURE — MOVEMENT & CONTRAST</span>
            <span class="header-category">04</span>
        </div>

        <div class="studio-trio-layout">
            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['santos_hero']}" alt="Santos Movement">
                </div>
                <div>
                    <p class="trio-caption">SANTOS — MOVEMENT SERIES</p>
                    <p class="trio-sub">High-shutter dynamic capture</p>
                </div>
            </div>

            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['jon_noir']}" alt="Jon High Contrast">
                </div>
                <div>
                    <p class="trio-caption">JON — HIGH CONTRAST MONO</p>
                    <p class="trio-sub">Chiaroscuro studio lighting</p>
                </div>
            </div>

            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['santos_jump']}" alt="Santos Studio 2">
                </div>
                <div>
                    <p class="trio-caption">SANTOS — ATHLETIC FORM</p>
                    <p class="trio-sub">Full-body spatial composition</p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>SUBJECTS: DANCE & CONTEMPORARY MOVEMENT</span>
            <span>LOCATION: 292 STUDIOS IN-HOUSE STAGE</span>
            <span>SERIES: 2025–2026 ARCHIVE</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 5: STUDIO PORTRAITURE - COLOR & CELEBRATION
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">STUDIO PORTRAITURE — COLORWAYS & CELEBRATION</span>
            <span class="header-category">05</span>
        </div>

        <div class="studio-trio-layout">
            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['ebonie_hero']}" alt="Ebonie Studio Shoot">
                </div>
                <div>
                    <p class="trio-caption">EBONIE — WARM MINIMALISM</p>
                    <p class="trio-sub">Warm earthy backdrop & soft key</p>
                </div>
            </div>

            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['rose_blue']}" alt="Rose 21st Birthday">
                </div>
                <div>
                    <p class="trio-caption">ROSE — ROYAL BLUE CANVAS</p>
                    <p class="trio-sub">Vibrant primary palette & fill lighting</p>
                </div>
            </div>

            <div class="trio-card">
                <div class="img-box">
                    <img src="{img_map['jay_bday']}" alt="Jay 20th Birthday">
                </div>
                <div>
                    <p class="trio-caption">JAY — BIRTHDAY MILESTONE</p>
                    <p class="trio-sub">Contemporary youth editorial</p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>FEATURES: SEAMLESS PAPER BACKDROPS</span>
            <span>CUSTOM COLORWAY PALETTES</span>
            <span>RETENTION OF NATURAL SKIN VALUES</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 6: PROFESSIONAL HEADSHOTS & BRANDING
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">PROFESSIONAL HEADSHOTS & PERSONAL BRANDING</span>
            <span class="header-category">06</span>
        </div>

        <div class="headshots-grid">
            <div class="headshot-card">
                <div class="img-box">
                    <img src="{img_map['headshot_beauty']}" alt="Beauty Test Shoot">
                </div>
                <div>
                    <p class="headshot-name">EDITORIAL BEAUTY</p>
                    <p class="headshot-role">High-Detail Retouch</p>
                </div>
            </div>

            <div class="headshot-card">
                <div class="img-box">
                    <img src="{img_map['headshot_pat']}" alt="Pat Headshot">
                </div>
                <div>
                    <p class="headshot-name">PAT</p>
                    <p class="headshot-role">Creative Professional</p>
                </div>
            </div>

            <div class="headshot-card">
                <div class="img-box">
                    <img src="{img_map['headshot_aldo']}" alt="Aldo Headshot">
                </div>
                <div>
                    <p class="headshot-name">ALDO</p>
                    <p class="headshot-role">Corporate & LinkedIn</p>
                </div>
            </div>

            <div class="headshot-card">
                <div class="img-box">
                    <img src="{img_map['headshot_vinay']}" alt="Vinay Headshot">
                </div>
                <div>
                    <p class="headshot-name">VINAY</p>
                    <p class="headshot-role">Executive Profile</p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>STANDARDS: FLATTERING 85MM/105MM FOCAL LENGTHS</span>
            <span>SHARP IRIS REFLECTIONS</span>
            <span>INDUSTRY-STANDARD CROPS</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 7: GRADUATION & ENVIRONMENTAL MILESTONES
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">GRADUATION & ENVIRONMENTAL MILESTONES</span>
            <span class="header-category">07</span>
        </div>

        <div class="grad-layout">
            <div class="img-box" style="height: 5.7in;">
                <img src="{img_map['grad_hero']}" alt="Jade Graduation Portrait">
            </div>

            <div class="grad-side">
                <div class="grad-side-imgs">
                    <div class="img-box">
                        <img src="{img_map['grad_cap']}" alt="Graduation Cap Detail">
                    </div>
                    <div class="img-box">
                        <img src="{img_map['grad_joy']}" alt="Graduation Candid">
                    </div>
                </div>

                <div class="studio-meta-box">
                    <h3 class="studio-meta-title">JADE — COMMENCEMENT</h3>
                    <p class="studio-meta-desc">
                        Balancing on-location natural daylight with controlled fill reflectors. Environmental graduation portraiture captures academic triumph with warmth, crisp subject separation, and documentary authenticity.
                    </p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>SERIES: COMMENCEMENT PORTRAITURE</span>
            <span>LOCATION: UNIVERSITY CAMPUS ON-LOCATION</span>
            <span>AMBIENT LIGHT BALANCING</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 8: AUTOMOTIVE & COMMERCIAL SHOWCASE
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">AUTOMOTIVE & COMMERCIAL SHOWCASE</span>
            <span class="header-category">08</span>
        </div>

        <div class="auto-layout">
            <div class="auto-hero-box img-box">
                <img src="{img_map['auto_lineup']}" alt="Sports Car Lineup at Dusk">
            </div>

            <div class="auto-bottom-row">
                <div class="img-box" style="height: 2.2in;">
                    <img src="{img_map['auto_hero']}" alt="Automotive Detail">
                </div>
                <div class="auto-details-text">
                    <h3>TWILIGHT MOTORSPORT SERIES</h3>
                    <p>
                        Capturing the sculpture, metallic reflections, and aerodynamic lines of modern performance vehicles under challenging mixed twilight conditions. Emphasizes clean panel reflections and rich color rendition.
                    </p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>GENRE: COMMERCIAL AUTOMOTIVE</span>
            <span>CONDITIONS: DUSK / NATURAL AMBIENT + STROBE ACCENTS</span>
            <span>COMMUNITY: NJ AUTOMOTIVE ENTHUSIASTS</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 9: PACKAGES & TECHNICAL SPECIFICATIONS
         ======================================================= -->
    <div class="page">
        <div class="header-bar">
            <span class="header-logo">292 STUDIOS</span>
            <span class="header-category">SERVICES, PACKAGES & WORKFLOW</span>
            <span class="header-category">09</span>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <div class="services-grid">
                <!-- Headshots -->
                <div class="service-card">
                    <div>
                        <h3 class="service-tier">HEADSHOTS</h3>
                        <div class="service-price">$150</div>
                        <ul class="service-features">
                            <li>1–2 Curated Looks</li>
                            <li>1 Hour Studio Session</li>
                            <li>1 Solid Backdrop Choice</li>
                            <li>3 Master Retouched Photos</li>
                            <li>1 Round of Client Re-edits</li>
                            <li>5–14 Day Turnaround</li>
                        </ul>
                    </div>
                </div>

                <!-- Basic -->
                <div class="service-card popular">
                    <span class="badge-pop">MOST POPULAR</span>
                    <div>
                        <h3 class="service-tier">BASIC PACKAGE</h3>
                        <div class="service-price">$200</div>
                        <ul class="service-features">
                            <li>1 Curated Look / Concept</li>
                            <li>1.5 Hours Shooting Time</li>
                            <li>1 Backdrop (Custom Colorway)</li>
                            <li>6 Master Retouched Photos</li>
                            <li>1 Round of Client Re-edits</li>
                            <li>Full High-Res Deliverables</li>
                        </ul>
                    </div>
                </div>

                <!-- Deluxe -->
                <div class="service-card">
                    <div>
                        <h3 class="service-tier">DELUXE PACKAGE</h3>
                        <div class="service-price">$300</div>
                        <ul class="service-features">
                            <li>1+ Multiple Outfit Changes</li>
                            <li>1.5 Hours Studio Time</li>
                            <li>2 Distinct Backdrop Setups</li>
                            <li>6 Master Retouched Photos</li>
                            <li>1 Round of Client Re-edits</li>
                            <li>Maximum Visual Variety</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="standards-bar">
                <div class="standard-col">
                    <h4>COLOR PROFILES & CALIBRATION</h4>
                    <p>All assets processed in calibrated RGB color spaces ensuring flawless fidelity across social platforms, e-commerce, and print.</p>
                </div>
                <div class="standard-col">
                    <h4>NON-DESTRUCTIVE RETOUCH</h4>
                    <p>Precision skin and tone cleanup preserving real human pore texture without artificial warping or synthetic blurring.</p>
                </div>
                <div class="standard-col">
                    <h4>DIGITAL ASSET PROTOCOLS</h4>
                    <p>Strict file versioning, automated cloud redundancies, and client proof delivery within 1–5 days from session wrap.</p>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>ADD-ONS: FULL SESSION JPEGS (+$25) | RUSH TURNAROUND 1–3 DAYS (+$50)</span>
            <span>CUSTOM INQUIRIES WELCOME</span>
        </div>
    </div>

    <!-- =======================================================
         PAGE 10: BACK COVER / CONTACT
         ======================================================= -->
    <div class="page back-cover">
        <h2 class="back-logo">292 STUDIOS</h2>
        <p class="back-sub">BY VISHNU KUMAR</p>
        <div class="back-line"></div>

        <div class="contact-grid">
            <div class="contact-item">
                <span class="contact-label">ONLINE PORTFOLIO</span>
                <span class="contact-value">292studios.com</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">DIRECT INQUIRIES</span>
                <span class="contact-value">kumarvishnu292@gmail.com</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">INSTAGRAM</span>
                <span class="contact-value">@292_studios</span>
            </div>
            <div class="contact-item">
                <span class="contact-label">STUDIO LOCATION</span>
                <span class="contact-value">Sayreville, NJ</span>
            </div>
        </div>

        <p class="back-footer-text">
            STUDIO & ON-LOCATION SESSIONS THROUGHOUT NEW JERSEY & TRI-STATE AREA
        </p>
    </div>

</body>
</html>
"""

    html_file = "portfolio_lookbook.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"HTML lookbook generated at {html_file}")
    
    # Compile to PDF using Edge Headless
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    pdf_output = "Vishnu_Kumar_292_Studios_Portfolio.pdf"
    
    abs_html = os.path.abspath(html_file)
    abs_pdf = os.path.abspath(pdf_output)
    
    print("Compiling PDF with Edge Headless Print...")
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={abs_pdf}",
        abs_html
    ]
    
    res = subprocess.run(cmd)
    if os.path.exists(abs_pdf):
        size_mb = os.path.getsize(abs_pdf) / (1024 * 1024)
        print(f"SUCCESS! PDF Portfolio created: {pdf_output} ({size_mb:.2f} MB)")
    else:
        print("Error: PDF output file was not created.")

if __name__ == "__main__":
    build_portfolio()
