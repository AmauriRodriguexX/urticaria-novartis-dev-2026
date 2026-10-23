import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.abspath("screenshots_viewport")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        # 1366x768 matches standard laptop 16:9 for larger readable UI elements
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page()

        print("=== 1. CAPTURANDO LANDINGS WEB (SOLO PRIMERA PANTALLA / VIEWPORT 1080P) ===")
        landings = [
            ("01_home_dia.png", "http://localhost:4173/?vista=dia"),
            ("02_home_calor.png", "http://localhost:4173/?vista=calor"),
            ("03_home_frio.png", "http://localhost:4173/?vista=frio"),
            ("04_home_madrugada.png", "http://localhost:4173/?vista=madrugada"),
            ("05_home_noche_calor.png", "http://localhost:4173/?vista=noche-calor"),
            ("06_sintomas.png", "http://localhost:4173/sintomas/"),
            ("07_tratamiento.png", "http://localhost:4173/tratamiento/"),
            ("08_sobre_nosotros.png", "http://localhost:4173/sobre-nosotros/"),
            ("09_error_404.png", "http://localhost:4173/pagina-inexistente/"),
            ("10_recursos_hub.png", "http://localhost:4173/recursos-herramientas/"),
            ("11_diario_sintomas.png", "http://localhost:4173/diario/"),
            ("12_testimonios_comunidad.png", "http://localhost:4173/testimonios/"),
            ("13_directorio_landing.png", "http://localhost:4173/directorio-medico/"),
            ("14_blog_feed.png", "http://localhost:4173/blog/"),
            ("15_blog_articulo_1.png", "http://localhost:4173/blog/que-significa-uce/"),
            ("16_blog_articulo_2.png", "http://localhost:4173/blog/preparar-consulta/"),
            ("17_blog_articulo_3.png", "http://localhost:4173/blog/dietas-restrictivas-uce/"),
            ("18_quiz_intro_landing.png", "http://localhost:4173/test/"),
        ]

        for filename, url in landings:
            print(f"Capturando {filename}...")
            page.goto(url, wait_until="networkidle")
            time.sleep(0.5)
            # full_page=False: solo la pantalla visible (viewport 1080p)
            page.screenshot(path=os.path.join(OUTPUT_DIR, filename), full_page=False)

        print("=== 2. CAPTURANDO BIBLIOTECA MODAL (LIGHTBOX) ===")
        page.goto("http://localhost:4173/recursos-herramientas/#biblioteca", wait_until="networkidle")
        time.sleep(0.5)
        photo_btn = page.locator("button.photo-tile").first
        if photo_btn.count() > 0:
            photo_btn.click()
            time.sleep(0.5)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "19_biblioteca_modal.png"), full_page=False)

        print("=== 3. CAPTURANDO RAMA DE URGENCIA Y MAPA DEL QUIZ ===")
        page.goto("http://localhost:4173/", wait_until="networkidle")
        time.sleep(0.5)
        page.locator("button:has-text('Hacer Test')").first.click()
        page.wait_for_selector(".modal-inner")
        time.sleep(0.5)
        
        # Q0 -> Continuar
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q1 -> Hinchazón
        page.locator(".options button:has-text('Hinchazón')").first.click()
        time.sleep(0.2)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q1b -> Descarte urgencia
        page.screenshot(path=os.path.join(OUTPUT_DIR, "20_quiz_q1b_descarte_urgencia.png"), full_page=False)
        
        # Click en urgente
        page.locator(".options button:has-text('labios, lengua, garganta')").first.click()
        time.sleep(0.5)
        # Pantalla de urgencia 911
        page.screenshot(path=os.path.join(OUTPUT_DIR, "21_quiz_urgencia_911.png"), full_page=False)

        # Click en ver especialistas desde urgencia
        page.locator("button:has-text('Ver especialistas')").first.click()
        time.sleep(0.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "22_quiz_modal_directorio.png"), full_page=False)

        print("=== 4. CAPTURANDO RAMA ASINTOMÁTICA ===")
        page.goto("http://localhost:4173/", wait_until="networkidle")
        time.sleep(0.5)
        page.locator("button:has-text('Hacer Test')").first.click()
        page.wait_for_selector(".modal-inner")
        time.sleep(0.5)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)
        page.locator(".options button:has-text('Ninguno de estos')").first.click()
        time.sleep(0.2)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "23_quiz_resultado_asintomatico.png"), full_page=False)

        print("=== 5. CAPTURANDO RECORRIDO COMPLETO PASO A PASO ===")
        page.goto("http://localhost:4173/", wait_until="networkidle")
        time.sleep(0.5)
        page.locator("button:has-text('Hacer Test')").first.click()
        page.wait_for_selector(".modal-inner")
        time.sleep(0.5)

        # Q0: Nombre
        page.screenshot(path=os.path.join(OUTPUT_DIR, "24_quiz_q0_nombre.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q1: Síntomas generales
        page.locator(".options button:has-text('Ronchas')").first.click()
        page.locator(".options button:has-text('Comezón')").first.click()
        page.locator(".options button:has-text('Hinchazón')").first.click()
        time.sleep(0.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "25_quiz_q1_sintomas.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q1b: No urgente
        page.locator(".options button:has-text('párpados, manos o pies')").first.click()
        time.sleep(0.4)

        # Q2: Duración
        page.screenshot(path=os.path.join(OUTPUT_DIR, "26_quiz_q2_duracion.png"), full_page=False)
        page.locator(".options button:has-text('Más de 6 meses')").first.click()
        time.sleep(0.4)

        # Q3: Cantidad de ronchas
        page.screenshot(path=os.path.join(OUTPUT_DIR, "27_quiz_q3_ronchas.png"), full_page=False)
        page.locator(".options button:has-text('Moderada')").first.click()
        time.sleep(0.4)

        # Q4: Intensidad picazón
        page.screenshot(path=os.path.join(OUTPUT_DIR, "28_quiz_q4_picazon.png"), full_page=False)
        page.locator(".options button:has-text('Alta / Severa')").first.click()
        time.sleep(0.4)

        # Q5: Severidad hinchazón
        page.screenshot(path=os.path.join(OUTPUT_DIR, "29_quiz_q5_hinchazon.png"), full_page=False)
        page.locator(".options button:has-text('Moderada')").first.click()
        time.sleep(0.4)

        # Q6: Áreas de vida afectadas
        for opt in ['Actividades diarias', 'Vida social', 'Vida sexual', 'Elección de vestimenta', 'Trabajo o estudios', 'Calidad de sueño']:
            btn = page.locator(f".options button:has-text('{opt}')").first
            if btn.count() > 0:
                btn.click()
        time.sleep(0.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "30_quiz_q6_calidad_vida.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q7: Actividades
        page.screenshot(path=os.path.join(OUTPUT_DIR, "31_quiz_q7_actividades.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q8: Sociales
        page.screenshot(path=os.path.join(OUTPUT_DIR, "32_quiz_q8_sociales.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q8b: Sexual
        page.screenshot(path=os.path.join(OUTPUT_DIR, "33_quiz_q8b_sexual.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q9: Vestimenta
        page.screenshot(path=os.path.join(OUTPUT_DIR, "34_quiz_q9_vestimenta.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q10: Trabajo
        page.screenshot(path=os.path.join(OUTPUT_DIR, "35_quiz_q10_trabajo.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q11: Sueño
        page.screenshot(path=os.path.join(OUTPUT_DIR, "36_quiz_q11_sueno.png"), full_page=False)
        page.locator(".options button:has-text('Mucho')").first.click()
        time.sleep(0.4)

        # Q12: Desencadenantes
        page.locator(".options button:has-text('caliente')").first.click()
        page.locator(".options button:has-text('Estrés')").first.click()
        time.sleep(0.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "37_quiz_q12_detonantes.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q13: Momento del día
        page.screenshot(path=os.path.join(OUTPUT_DIR, "38_quiz_q13_horario.png"), full_page=False)
        page.locator(".options button:has-text('Por la noche o madrugada')").first.click()
        time.sleep(0.4)

        # Q14: Consulta médica previa
        page.screenshot(path=os.path.join(OUTPUT_DIR, "39_quiz_q14_consulta_previa.png"), full_page=False)
        page.locator(".options button:has-text('Sí')").first.click()
        time.sleep(0.4)

        # Q15: Frecuencia de consulta
        page.screenshot(path=os.path.join(OUTPUT_DIR, "40_quiz_q15_frecuencia_consulta.png"), full_page=False)
        page.locator(".options button:has-text('Frecuentemente')").first.click()
        time.sleep(0.4)

        # Q16: Especialista consultado
        page.locator(".options button:has-text('Dermatólogo/a')").first.click()
        time.sleep(0.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "41_quiz_q16_especialista.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q17: Tratamiento previo
        page.screenshot(path=os.path.join(OUTPUT_DIR, "42_quiz_q17_tratamiento_previo.png"), full_page=False)
        page.locator(".options button:has-text('Sí')").first.click()
        time.sleep(0.4)

        # Q18: Tipo de tratamiento
        page.locator(".options button:has-text('Intermedio')").first.click()
        time.sleep(0.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "43_quiz_q18_tipo_tratamiento.png"), full_page=False)
        page.locator(".quiz-nav .nav-next, button:has-text('Continuar')").first.click()
        time.sleep(0.4)

        # Q19: Efectividad percibida
        page.screenshot(path=os.path.join(OUTPUT_DIR, "44_quiz_q19_efectividad.png"), full_page=False)
        page.locator(".options button:has-text('Poco efectivo')").first.click()
        time.sleep(0.8)

        # Pantalla de Resultados y Reporte Completo
        page.screenshot(path=os.path.join(OUTPUT_DIR, "45_quiz_resultado_reporte_completo.png"), full_page=False)

        print("=== TODAS LAS CAPTURAS VIEWPORT 1080P COMPLETADAS ===")
        browser.close()

if __name__ == "__main__":
    run()
