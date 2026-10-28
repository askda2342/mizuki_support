(() => {
  const emergencyItems = [
    {
      label: "VALE OFICIAL",
      text: "Vale por un beso."
    },
    {
      label: "VALE OFICIAL",
      text: "Vale por un abrazo."
    },
    {
      label: "VALE OFICIAL",
      text: "Vale para hacer otro bebé."
    },
    {
      label: "VALE OFICIAL",
      text: "Vale por una cita."
    },
    {
      label: "VALE OFICIAL",
      text: "Vale por una película."
    },
    {
      label: "SOPORTE AUDITIVO",
      text: "Prescripción del sistema: una canción para ti.",
      link: "https://www.youtube.com/watch?v=Lin1z_EggG8",
      linkText: "escuchar canción ↗"
    },
    {
      label: "VALE GASTRONÓMICO",
      text: "Vale para comer TORTAS, no pasteles."
    },
    {
      label: "FORTUNA DEL DÍA",
      text: "☀️ Sé que los días están siendo pesados y llenos de nubes, por eso te dedico El Sol, para que sea el recordatorio constante de que tu brillo interior es más fuerte que cualquier nube gris y tus ojitos y tu mente brillante son capaces de despejar todo."
    },
    {
      label: "VALE OFICIAL",
      text: "Vale por elegir la próxima comida juntos.\n\nSin derecho a veto. Excepto si dices pasas."
    },
    {
      label: "PROTOCOLO DE DISTRACCIÓN",
      text: "Vale por un baile de emergencia.\n\nCanjeable cuando necesites distraerte, pero sin tocar."
    },
    {
      label: "CITA SORPRESA",
      text: "Vale por una cita sorpresa organizada por John.\n\nTú solo tienes que aparecer."
    },
    {
      label: "CUPÓN DE PRINCESA",
      text: "Hoy no decides nada. John se encarga."
    },
    {
      label: "PREGUNTA DE EMERGENCIA",
      text: "¿Qué quieres hacer conmigo cuando por fin estemos juntitos y tengamos un día entero sin obligaciones?"
    },
    {
      label: "RECORDATORIO OFICIAL",
      text: "Aunque hoy hayas avanzado poquito, sigues siendo el pericote más hermoso de todo el departamento de diseños."
    },
    {
      label: "JACKPOT",
      text: "Has obtenido 1 (una) petición razonable sin preguntas.\n\nSujeto a términos y condiciones completamente arbitrarios."
    },

    {
      label: "VALIDACIÓN DEL SISTEMA",
      text: "No tienes que demostrar nada hoy para merecer descansar un poco."
    },
    {
      label: "MENSAJE DE SOPORTE",
      text: "Aunque sientas que avanzaste poco, sigues avanzando. Y eso también cuenta."
    },
    {
      label: "RECORDATORIO IMPORTANTE",
      text: "No todo tiene que salir perfecto para que lo que hiciste tenga valor."
    },
    {
      label: "ESTADO DEL SISTEMA: HUMANO",
      text: "Estar cansado no significa que estés fallando. Significa que llevas rato sosteniendo muchas cosas."
    },
    {
      label: "NOTIFICACIÓN DE JOHN",
      text: "No necesitas ser productivo para que yo esté orgulloso de ti. Ya me gustas así, pericote."
    }
  ];

  const friedItems = [
    {
      label: "PROTOCOLO: AGUA",
      text: "Ve por agua. Sí, ahora. El archivo seguirá ahí cuando regreses."
    },
    {
      label: "REINICIO DE SISTEMA",
      text: "Cierra los ojos durante 60 segundos. No diseñes mentalmente durante esos 60 segundos tampoco."
    },
    {
      label: "DIAGNÓSTICO: DEMASIADAS CAPAS",
      text: "Levántate, estira cuello, espalda y hombros. Tu cuerpo no es otra mesa de trabajo."
    },
    {
      label: "ERROR 404: CREATIVIDAD NO ENCONTRADA",
      text: "Está permitido hacer algo feo primero. Después lo arreglas. Así funciona sospechosamente gran parte del diseño."
    },
    {
      label: "PAUSA OBLIGATORIA",
      text: "Cinco minutos de algo que no tenga tipografía, retícula, Illustrator, InDesign ni profesores."
    },
    {
      label: "SOPORTE REMOTO ACTIVADO",
      text: "Mándale a John únicamente este emoji: 🆘. Él sabrá que el cerebro murió."
    },
    {
      label: "TRATAMIENTO DE EMERGENCIA",
      text: "Busca a la Rotoplas o a la pelonchis y hazle “bop” en la nariz."
    },
    {
      label: "PERMISO OFICIAL PARA PARAR",
      text: "No necesitas terminar todo en este preciso minuto para haber hecho suficiente por hoy."
    },
    {
      label: "INSTRUCCIÓN DEL SISTEMA",
      text: "Pícate la cola.\n\nTe amo."
    }
  ];

  const STORAGE_KEYS = {
    emergency: "mizuki_support_seen_emergency_v2",
    fried: "mizuki_support_seen_fried_v2"
  };

  let activeMode = "emergency";

  const emergencyButton = document.getElementById("emergencyButton");
  const friedButton = document.getElementById("friedButton");
  const resultModal = document.getElementById("resultModal");
  const resultLabel = document.getElementById("resultLabel");
  const resultCounter = document.getElementById("resultCounter");
  const resultText = document.getElementById("resultText");
  const resultLink = document.getElementById("resultLink");
  const anotherButton = document.getElementById("anotherButton");

  function safeRead(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // La página sigue funcionando aunque localStorage esté bloqueado.
    }
  }

  function poolFor(mode) {
    return mode === "fried" ? friedItems : emergencyItems;
  }

  function keyFor(mode) {
    return mode === "fried" ? STORAGE_KEYS.fried : STORAGE_KEYS.emergency;
  }

  function getNextIndex(mode) {
    const pool = poolFor(mode);
    const key = keyFor(mode);

    let seen = safeRead(key).filter(
      index => Number.isInteger(index) && index >= 0 && index < pool.length
    );

    let available = pool
      .map((_, index) => index)
      .filter(index => !seen.includes(index));

    if (available.length === 0) {
      seen = [];
      available = pool.map((_, index) => index);
    }

    const nextIndex = available[Math.floor(Math.random() * available.length)];
    seen.push(nextIndex);
    safeWrite(key, seen);

    return nextIndex;
  }

  function renderItem(item, index) {
    resultLabel.textContent = item.label || "PROTOCOLO";
    resultCounter.textContent = String(index + 1).padStart(2, "0");
    resultText.textContent = item.text || "";

    if (item.link) {
      resultLink.hidden = false;
      resultLink.href = item.link;
      resultLink.textContent = item.linkText || "abrir enlace ↗";
    } else {
      resultLink.hidden = true;
      resultLink.removeAttribute("href");
    }
  }

  function showRandom(mode) {
    activeMode = mode;
    const pool = poolFor(mode);
    const index = getNextIndex(mode);
    renderItem(pool[index], index);
    resultModal.hidden = false;
  }

  function closeModal() {
    resultModal.hidden = true;
  }

  emergencyButton.addEventListener("click", () => showRandom("emergency"));
  friedButton.addEventListener("click", () => showRandom("fried"));
  anotherButton.addEventListener("click", () => showRandom(activeMode));

  document.querySelectorAll("[data-close]").forEach(element => {
    element.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && !resultModal.hidden) {
      closeModal();
    }
  });
})();
