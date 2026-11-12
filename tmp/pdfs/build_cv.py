from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, KeepTogether, FrameBreak
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

OUT = "output/pdf/fernando-salazar-cv.pdf"
PURPLE = colors.HexColor("#8D43F5")
INK = colors.HexColor("#17151D")
MUTED = colors.HexColor("#66636D")
RULE = colors.HexColor("#DCD8E2")
W, H = letter
LEFT = 42
GUTTER = 22
COL_W = (W - LEFT * 2 - GUTTER) / 2
TOP = 130
BOTTOM = 38

class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=letter, leftMargin=LEFT, rightMargin=LEFT, topMargin=TOP, bottomMargin=BOTTOM)
        left = Frame(LEFT, BOTTOM, COL_W, H - TOP - BOTTOM, id="left", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        right = Frame(LEFT + COL_W + GUTTER, BOTTOM, COL_W, H - TOP - BOTTOM, id="right", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates(PageTemplate(id="resume", frames=[left, right], onPage=self.draw_header))
        self.title = "Fernando Salazar - Curriculum Vitae"
        self.author = "Fernando Salazar"

    def draw_header(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(INK)
        canvas.rect(0, H - 126, W, 126, fill=1, stroke=0)
        canvas.setFillColor(PURPLE)
        canvas.rect(0, H - 130, W, 4, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 27)
        canvas.drawString(LEFT, H - 46, "Fernando Salazar")
        canvas.setFillColor(colors.HexColor("#D0CAD8"))
        canvas.setFont("Helvetica-Bold", 9)
        canvas.drawString(LEFT, H - 66, "SOFTWARE DEVELOPMENT  /  AI AUTOMATION  /  AUDIOVISUAL")
        canvas.setFillColor(colors.HexColor("#E5E1E9"))
        canvas.setFont("Helvetica", 9)
        canvas.drawString(LEFT, H - 91, "Software Analysis and Development student at SENA with experience in independent software projects,")
        canvas.drawString(LEFT, H - 105, "workflow automation, photography, videography, and multimedia production.")
        canvas.setFillColor(PURPLE)
        canvas.rect(LEFT, H - 119, 36, 2, fill=1, stroke=0)
        canvas.setStrokeColor(RULE)
        canvas.line(LEFT + COL_W + GUTTER / 2, BOTTOM, LEFT + COL_W + GUTTER / 2, H - TOP - 4)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawString(LEFT, 20, "FERNANDO.DEV  |  CURRICULUM VITAE")
        canvas.drawRightString(W - LEFT, 20, f"{doc.page}")
        canvas.restoreState()

styles = {
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=PURPLE, spaceAfter=7, uppercase=True),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=8.5, leading=10.5, textColor=INK, spaceAfter=1),
    "meta": ParagraphStyle("meta", fontName="Helvetica-Bold", fontSize=7.3, leading=9, textColor=MUTED, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=7.5, leading=9.4, textColor=MUTED, spaceAfter=7),
    "skill": ParagraphStyle("skill", fontName="Helvetica", fontSize=7.5, leading=10, textColor=INK, spaceAfter=6),
}

def section(label):
    return [Paragraph(label.upper(), styles["section"]), Spacer(1, 1)]

def entry(title, meta, body):
    return KeepTogether([
        Paragraph(title, styles["title"]),
        Paragraph(meta, styles["meta"]),
        Paragraph(body, styles["body"]),
    ])

left_flow = section("Experience")
left_flow += [
    entry("Automation Developer &amp; Multimedia Content Producer", "2025 - 2026  |  Astralux", "Planned and built n8n and AI workflow automations. Produced and edited promotional video and social media content."),
    entry("Independent Software Developer", "2025 - Present  |  Independent projects and collaborations", "Designed and developed approximately nine software systems, including web applications, frontend and backend features, and database work."),
    entry("Camera Operator &amp; Director of Photography", "2022 - 2026  |  Independent and academic productions", "Contributed to four short films: camera operator on three productions, Director of Photography on two, and actor and photographer on another."),
    entry("Event Photographer", "2024  |  Freelance photography", "Photographed social events, primarily quinceañeras, with a focus on event coverage, portraits, composition, and visual storytelling."),
]

right_flow = section("Education")
right_flow += [
    entry("Technologist in Software Analysis and Development", "2026 - Present  |  SENA, Centro de Diseño y Metrología", ""),
    entry("Technical High School Diploma, Industrial Automation and Instrumentation", "2024  |  Colegio Grancolombiano IED", ""),
    entry("Photography Training Program", "2022  |  Proimágenes Colombia", ""),
    entry("English Language, A2", "2022  |  Universidad Libre", ""),
    entry("Web Development, self-directed learning", "Ongoing  |  Soy Dalto tutorials", ""),
    entry("AI Automation and Workflow Development", "Community-based learning  |  AIlink", ""),
    *section("Skills"),
    Paragraph("<b>Development</b><br/>HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Figma, Node.js, Python, PostgreSQL, Supabase, REST APIs, Git", styles["skill"]),
    Paragraph("<b>Automation and AI</b><br/>n8n, AI agents, RAG systems, OpenAI API, workflow automation, vector databases, ComfyUI, Higgsfield", styles["skill"]),
    Paragraph("<b>Media</b><br/>Photography, videography, video editing, Adobe Premiere Pro", styles["skill"]),
    Paragraph("<b>Languages</b><br/>Spanish; English (A2)", styles["skill"]),
]

doc = ResumeDoc(OUT)
doc.build(left_flow + [FrameBreak()] + right_flow)
print(OUT)
