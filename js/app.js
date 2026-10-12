/*
 * Manual y Guía de Fine-Tuning - Script Principal
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSearch();
    initCodeCopy();
    initProgressTracking();
    initWizard();
    initMobileMenu();
    initModelPlayground();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const savedTheme = localStorage.getItem('fine_tuning_guide_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('fine_tuning_guide_theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    function updateThemeUI(theme) {
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Claro';
            }
        }
    }
}

/* ==========================================================================
   2. Navigation & SPA Routing via Hash
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');
    const currentCrumb = document.getElementById('current-crumb');

    function activateSection(targetId, updateHash = true) {
        if (!targetId) targetId = 'inicio';

        // Hide all sections, remove active class
        sections.forEach(sec => sec.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        const targetNavItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (targetNavItem) {
                targetNavItem.classList.add('active');
                if (currentCrumb) {
                    currentCrumb.textContent = targetNavItem.querySelector('.nav-text')?.textContent || targetId;
                }
            }

            if (updateHash) {
                history.pushState(null, null, `#${targetId}`);
            }

            // Track reading progress
            saveProgress(targetId);
        }
    }

    // Nav click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            activateSection(target);

            // Close mobile menu if open
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        });
    });

    // Handle back/forward & direct links
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        activateSection(hash || 'inicio', false);
    });

    // Initial load check
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        activateSection(initialHash, false);
    } else {
        activateSection('inicio', false);
    }
}

/* ==========================================================================
   3. Real-time Search Filter
   ========================================================================== */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const navGroups = document.querySelectorAll('.nav-group');
    const navItems = document.querySelectorAll('.nav-item');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });

        // Hide empty nav groups
        navGroups.forEach(group => {
            const visibleChildren = group.querySelectorAll('.nav-item[style*="display: flex"], .nav-item:not([style*="display"])');
            const hasVisible = Array.from(visibleChildren).some(child => child.style.display !== 'none');
            group.style.display = hasVisible ? 'block' : 'none';
        });
    });
}

/* ==========================================================================
   4. Code Copy to Clipboard
   ========================================================================== */
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-wrapper');
            const codeBlock = wrapper ? wrapper.querySelector('code') : null;

            if (codeBlock) {
                try {
                    await navigator.clipboard.writeText(codeBlock.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ ¡Copiado!';
                    btn.style.backgroundColor = 'var(--accent-emerald)';
                    btn.style.color = '#fff';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    btn.textContent = '❌ Error';
                }
            }
        });
    });
}

/* ==========================================================================
   5. Reading Progress Tracking
   ========================================================================== */
const TOTAL_SECTIONS = 6;

function saveProgress(sectionId) {
    if (sectionId === 'inicio') return;

    let readSections = JSON.parse(localStorage.getItem('fine_tuning_read_sections')) || [];
    if (!readSections.includes(sectionId)) {
        readSections.push(sectionId);
        localStorage.setItem('fine_tuning_read_sections', JSON.stringify(readSections));
    }
    updateProgressUI(readSections);
}

function initProgressTracking() {
    const readSections = JSON.parse(localStorage.getItem('fine_tuning_read_sections')) || [];
    updateProgressUI(readSections);

    // Manual completion buttons inside sections
    const completionBtns = document.querySelectorAll('.completion-btn');
    completionBtns.forEach(btn => {
        const sectionId = btn.getAttribute('data-section');
        if (readSections.includes(sectionId)) {
            setBtnCompleted(btn);
        }

        btn.addEventListener('click', () => {
            let currentRead = JSON.parse(localStorage.getItem('fine_tuning_read_sections')) || [];
            if (!currentRead.includes(sectionId)) {
                currentRead.push(sectionId);
                localStorage.setItem('fine_tuning_read_sections', JSON.stringify(currentRead));
                setBtnCompleted(btn);
                updateProgressUI(currentRead);
            }
        });
    });
}

function setBtnCompleted(btn) {
    btn.classList.add('completed');
    btn.innerHTML = '✓ Sección Leída y Completada';
}

function updateProgressUI(readSections) {
    const valElem = document.getElementById('progress-val');
    const fillElem = document.getElementById('progress-fill');

    if (valElem && fillElem) {
        const percent = Math.min(Math.round((readSections.length / TOTAL_SECTIONS) * 100), 100);
        valElem.textContent = `${percent}%`;
        fillElem.style.width = `${percent}%`;
    }
}

/* ==========================================================================
   6. Interactive Decision Wizard (Model Playground)
   ========================================================================== */
function initWizard() {
    const modelState = {
        modelType: null,   // 'bert', 'roberta', 'distilbert'
        dataset: null,     // 'custom', 'existing'
        epochs: null,     // '3', '5', '10'
        learningRate: null // 'default', 'custom'
    };

    let currentStep = 1;
    const totalSteps = 4;

    const stepDots = document.querySelectorAll('.step-dot');
    const wizardSteps = document.querySelectorAll('.wizard-step');

    // Selection handling
    document.querySelectorAll('.wizard-step .option-card').forEach(card => {
        card.addEventListener('click', () => {
            const step = card.closest('.wizard-step');
            const key = step.getAttribute('data-wizard-key');
            const val = card.getAttribute('data-value');

            // Toggle selection UI within step
            step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            modelState[key] = val;

            // Enable Next button
            const nextBtn = step.querySelector('.btn-next');
            if (nextBtn) nextBtn.disabled = false;
        });
    });

    // Navigation buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            } else if (currentStep === totalSteps) {
                calculateAndShowResult();
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    });

    const resetBtn = document.getElementById('reset-wizard-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(modelState).forEach(k => modelState[k] = null);
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.btn-next').forEach(b => b.disabled = true);

            document.getElementById('wizard-result').style.display = 'none';
            goToStep(1);
        });
    }

    function goToStep(stepNum) {
        currentStep = stepNum;

        wizardSteps.forEach(s => s.classList.remove('active'));
        const activeStep = document.querySelector(`.wizard-step[data-step="${stepNum}"]`);
        if (activeStep) activeStep.classList.add('active');

        stepDots.forEach((dot, idx) => {
            const dStep = idx + 1;
            dot.classList.remove('active', 'completed');
            if (dStep === currentStep) {
                dot.classList.add('active');
            } else if (dStep < currentStep) {
                dot.classList.add('completed');
                dot.textContent = '✓';
            } else {
                dot.textContent = dStep;
            }
        });
    }

    function calculateAndShowResult() {
        const { modelType, dataset, epochs, learningRate } = modelState;

        let modelName = "";
        let datasetName = "";
        let epochsValue = "";
        let learningRateValue = "";
        let rationale = "";

        // Decision Tree Logic
        if (modelType === 'bert') {
            modelName = "BERT";
            rationale += "BERT es ideal para tareas de procesamiento de lenguaje natural. ";
        } else if (modelType === 'roberta') {
            modelName = "RoBERTa";
            rationale += "RoBERTa es conocido por su rendimiento en tareas de comprensión de texto. ";
        } else {
            modelName = "DistilBERT";
            rationale += "DistilBERT es una versión más ligera de BERT, ideal para dispositivos con recursos limitados. ";
        }

        if (dataset === 'custom') {
            datasetName = "Dataset Personalizado";
            rationale += "Usar un dataset personalizado te permite adaptar el modelo a tus datos específicos. ";
        } else {
            datasetName = "Dataset Existente";
            rationale += "Usar un dataset existente puede ser más rápido, pero puede no ser tan relevante para tu caso de uso. ";
        }

        if (epochs === '3') {
            epochsValue = "3 épocas";
            rationale += "3 épocas son suficientes para la mayoría de tareas de fine-tuning. ";
        } else if (epochs === '5') {
            epochsValue = "5 épocas";
            rationale += "5 épocas pueden ser necesarias para tareas más complejas. ";
        } else {
            epochsValue = "10 épocas";
            rationale += "10 épocas pueden ser necesarias para tareas muy complejas o con datos muy grandes. ";
        }

        if (learningRate === 'default') {
            learningRateValue = "Tasa de Aprendizaje Predeterminada";
            rationale += "La tasa de aprendizaje predeterminada es una buena opción para la mayoría de casos. ";
        } else {
            learningRateValue = "Tasa de Aprendizaje Personalizada";
            rationale += "Una tasa de aprendizaje personalizada puede ser necesaria para tareas muy complejas o con datos muy grandes. ";
        }

        // Populate Result UI
        document.getElementById('rec-model-name').textContent = modelName;
        document.getElementById('rec-dataset').textContent = datasetName;
        document.getElementById('rec-epochs').textContent = epochsValue;
        document.getElementById('rec-learning-rate').textContent = learningRateValue;
        document.getElementById('rec-rationale').textContent = rationale;

        // Hide steps, show result card
        wizardSteps.forEach(s => s.classList.remove('active'));
        const resultCard = document.getElementById('wizard-result');
        if (resultCard) resultCard.style.display = 'block';
    }
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

/* ==========================================================================
   8. Model Playground (Demo Interactiva)
   ========================================================================== */
const MODEL_DATASETS = {
    bert: {
        name: "BERT (bert-base-uncased)",
        params: "110M parámetros",
        layers: "12 capas Transformer",
        hidden: "768 dimensiones ocultas",
        heads: "12 cabezas de atención",
        useCase: "Clasificación de texto, NER, Q&A. Ideal para tareas generales de NLP.",
        pros: "Amplia adopción, mucha documentación, compatible con la mayoría de pipelines."
    },
    roberta: {
        name: "RoBERTa (roberta-base)",
        params: "125M parámetros",
        layers: "12 capas Transformer",
        hidden: "768 dimensiones ocultas",
        heads: "12 cabezas de atención",
        useCase: "Comprensión de texto robusta. Supera a BERT en muchos benchmarks.",
        pros: "Mejor rendimiento en tareas de comprensión; entrenado con más datos y sin NSP."
    },
    distilbert: {
        name: "DistilBERT (distilbert-base-uncased)",
        params: "66M parámetros",
        layers: "6 capas Transformer",
        hidden: "768 dimensiones ocultas",
        heads: "12 cabezas de atención",
        useCase: "Inference ligera en edge/on-device. 40% más pequeño que BERT.",
        pros: "60% más rápido que BERT conservando el 95% de su capacidad."
    }
};

function initModelPlayground() {
    const selector = document.getElementById('model-selector');
    const loadBtn = document.getElementById('load-model-btn');
    const render = document.getElementById('model-render');

    if (!selector || !loadBtn || !render) return;

    loadBtn.addEventListener('click', () => {
        const key = selector.value;
        const model = MODEL_DATASETS[key];
        if (!model) {
            render.innerHTML = '<p class="model-render-empty">Modelo no encontrado.</p>';
            return;
        }

        render.innerHTML = `
            <div class="model-card" style="width:100%;">
                <h3 style="color: var(--accent-cyan); margin-bottom: 1rem; font-size: 1.3rem; font-weight: 800;">
                    🔬 ${model.name}
                </h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
                    <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Parámetros</div>
                        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${model.params}</div>
                    </div>
                    <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Capas</div>
                        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${model.layers}</div>
                    </div>
                    <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Hidden</div>
                        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${model.hidden}</div>
                    </div>
                    <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Atención</div>
                        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${model.heads}</div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Caso de Uso</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${model.useCase}</p>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Ventajas</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${model.pros}</p>
                </div>
            </div>
        `;
    });
}
