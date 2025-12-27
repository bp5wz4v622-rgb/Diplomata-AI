import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { SearchResult, PositionPaperData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const GeminiService = {
  /**
   * Feature 1: Smart Search
   */
  async searchResources(query: string): Promise<SearchResult> {
    try {
      const prompt = `
      Actúa como un asistente de investigación para un delegado MUN.
      Busca enlaces y recursos que respondan a la siguiente pregunta: "${query}".
      
      REGLAS ESTRICTAS DE FORMATO (MUY IMPORTANTE):
      1. ESTÁ PROHIBIDO usar asteriscos (*), viñetas o corchetes ([]). Tu respuesta debe ser texto plano y limpio.
      2. Para cada resultado, sigue estrictamente este orden:
         - Línea 1: La URL exacta del recurso.
         - Línea 2: Un párrafo breve explicando por qué este enlace está relacionado con la pregunta.
      3. Deja una línea en blanco entre cada recurso.
      
      REGLAS DE CONTENIDO:
      1. Prioriza fuentes .org, gubernamentales (.gov) o de la ONU.
      2. Organiza la información por fecha, poniendo la más reciente primero.
      3. No des información excesiva, ve al grano.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No se encontraron resultados.";
      // Extract grounding chunks for metadata display if available
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Fuente externa'
      })).filter((s: any) => s.uri) || [];

      return { text, sources };
    } catch (error) {
      console.error("Error en búsqueda:", error);
      throw new Error("Error al conectar con el servicio de búsqueda.");
    }
  },

  /**
   * Feature 2: Interpellation (Question Generation)
   */
  async interpellateSpeech(speech: string): Promise<string> {
    try {
      const prompt = `
      Actúa como la delegación de "To' Revuelto" en un Modelo de Naciones Unidas.
      Tu objetivo es realizar una INTERPELACIÓN (Point of Information / Pregunta) al delegado que acaba de dar el siguiente discurso.
      
      REGLAS:
      1. Identifícate explícitamente como: "La delegación de To' Revuelto...".
      2. NO hagas un análisis ni una corrección. Debes formular una PREGUNTA DESAFIANTE O CUESTIONAMIENTO DIRECTO.
      3. Basate en lo que acaba de decir el delegado en su discurso. Busca contradicciones, falta de realismo, hipocresía o falta de fondos.
      4. Usa lenguaje parlamentario estricto (siempre en tercera persona).
      
      Ejemplo de tono esperado:
      "Honorable mesa, la delegación de To' Revuelto ha escuchado con atención, pero se ve en la obligación de cuestionar: ¿Cómo pretende la delegación proponente financiar tal iniciativa...?"
      
      DISCURSO A INTERPELAR:
      "${speech}"
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      
      return response.text || "No se pudo generar la interpelación.";
    } catch (error) {
      console.error("Error en interpelación:", error);
      throw error;
    }
  },

  /**
   * Feature 2b: Generate Defense (Help the delegate answer)
   */
  async generateInterpellationDefense(speech: string, question: string): Promise<string> {
    try {
      const prompt = `
      Actúa como un ASESOR ESTRATÉGICO DEBATE para el delegado que dio el discurso.
      
      CONTEXTO:
      1. Discurso original: "${speech}"
      2. Pregunta hostil recibida (Interpelación): "${question}"
      
      TAREA:
      Genera una RESPUESTA DIPLOMÁTICA Y CONTUNDENTE para que el delegado la lea.
      
      REQUISITOS DE LA RESPUESTA:
      1. Debe responder directamente a la pregunta, usando datos lógicos o retórica inteligente.
      2. Debe usar lenguaje parlamentario formal (3ra persona: "Esta delegación...", "Agradecemos la pregunta...").
      3. Debe ser breve y concisa (máximo 1 párrafo).
      4. El objetivo es desarmar el argumento de "To' Revuelto" y dejar al delegado bien parado con conocimientos sólidos.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      
      return response.text || "No se pudo generar una sugerencia de defensa.";
    } catch (error) {
      console.error("Error en generación de defensa:", error);
      throw error;
    }
  },

  /**
   * Feature 2c: Evaluate Reply to Interpellation
   */
  async evaluateInterpellationReply(originalSpeech: string, question: string, reply: string): Promise<string> {
    try {
        const prompt = `
        Actúa como la MESA DIRECTIVA (Chair) de un Modelo de Naciones Unidas.
        
        CONTEXTO:
        1. Un delegado dio este discurso: "${originalSpeech}"
        2. La delegación de To' Revuelto le preguntó (Interpelación): "${question}"
        3. El delegado respondió: "${reply}"
        
        TAREA:
        Evalúa la respuesta del delegado.
        - ¿Respondió directamente a la pregunta o la evadió?
        - ¿Mantuvo el lenguaje diplomático y la calma?
        - ¿Su defensa fue lógica?
        
        Da un veredicto breve y un consejo para mejorar. Habla como la Mesa Directiva ("La Mesa considera que...").
        `;
  
        const response = await ai.models.generateContent({
          model: modelId,
          contents: prompt,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        
        return response.text || "No se pudo evaluar la respuesta.";
      } catch (error) {
        console.error("Error en evaluación de respuesta:", error);
        throw error;
      }
  },

  /**
   * Feature 3: Speech Correction
   */
  async correctSpeech(speech: string): Promise<string> {
    try {
      const prompt = `
      Corrige y analiza el siguiente discurso MUN basándote estrictamente en esta estructura:
      
      1. Introducción (Nivel Mundial): Contextualización global, datos internacionales (ONU, OMS, etc.).
      2. Desarrollo (Nivel Nacional): Enfoque en el país representado, medidas estatales, políticas internas.
      3. Conclusión (Nivel Internacional / Propuestas): Soluciones realistas y cooperativas.
      
      Evalúa si cumple cada sección y sugiere mejoras de redacción diplomática.
      
      DISCURSO:
      "${speech}"
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      return response.text || "No se pudo generar la corrección.";
    } catch (error) {
      console.error("Error en corrección:", error);
      throw error;
    }
  },

  /**
   * Feature 4: Topic Breakdown
   */
  async breakdownTopic(topic: string): Promise<string> {
    try {
      const prompt = `
      El delegado necesita investigar sobre el tópico: "${topic}".
      Proporciona una lista de preguntas de investigación profundas y estratégicas (Guía de investigación) para que el delegado pueda redactar su documento de posición o discurso.
      
      Las preguntas deben cubrir:
      - Antecedentes históricos.
      - Situación actual internacional.
      - Bloques y alianzas.
      - Acciones pasadas de la ONU.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      return response.text || "No se pudo desglosar el tópico.";
    } catch (error) {
      console.error("Error en desglose:", error);
      throw error;
    }
  },

  /**
   * Feature 5: Position Paper Review
   */
  async reviewPositionPaper(data: PositionPaperData): Promise<string> {
    try {
      const wordCount = data.content.split(/\s+/).filter(w => w.length > 0).length;
      
      const prompt = `
      Revisa el siguiente Documento de Posición (Position Paper).
      
      DATOS:
      - Tópico: ${data.topic}
      - Comisión: ${data.committee}
      - Delegación: ${data.delegation}
      - Delegado: ${data.delegateName}
      - Conteo de palabras actual: ${wordCount}
      
      REGLAS DE CORRECCIÓN:
      1. Verifica que el conteo de palabras esté entre 500 y 800. Si no, indícalo como error grave.
      2. Verifica que tenga estructura de discurso formal + Bibliografía al final.
      3. El tono debe ser diplomático.
      4. Revisa la coherencia entre la política exterior del país (${data.delegation}) y las propuestas.
      
      CONTENIDO:
      "${data.content}"
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      return response.text || "No se pudo revisar el documento.";
    } catch (error) {
      console.error("Error en revisión documento:", error);
      throw error;
    }
  },

  /**
   * Feature 6: Speech Generator
   */
  async generateSpeech(topic: string, country: string, totalTimeSeconds: number): Promise<string> {
    try {
      const targetTime = Math.max(30, totalTimeSeconds - 10); // Ensure at least 30s
      // Average speaking rate ~140 words per minute = ~2.3 words per second
      const targetWordCount = Math.floor(targetTime * 2.3);

      const prompt = `
      Escribe un discurso MUN (Modelo de Naciones Unidas) actuando estrictamente como la delegación de ${country}.
      
      PARÁMETROS:
      - Tópico: ${topic}
      - País: ${country}
      - Tiempo objetivo de lectura: ${targetTime} segundos (Aprox. ${targetWordCount} palabras). AJÚSTATE A ESTA EXTENSIÓN.
      
      ESTRUCTURA OBLIGATORIA (Sigue este orden):
      
      1. INTRODUCCIÓN (Contexto Global - Sin mencionar el tópico explícitamente):
         - NO digas "El tópico es..." ni menciones el nombre exacto del tema al inicio.
         - Aborda la problemática de manera global, emotiva y urgente.
         - Usa datos impactantes o contexto internacional.
         - El objetivo es captar la atención inmediatamente.
      
      2. DESARROLLO (Contexto Nacional - ${country} - Causa y Efecto):
         - Explica QUÉ medidas específicas (leyes, programas, tratados) ha tomado ${country} sobre este tema.
         - CRUCIAL: Explica POR QUÉ se tomaron esas medidas. ¿A qué problema, crisis o necesidad interna específica respondían?
         - Estructura lógica: "Debido a [Problemática X], la nación implementó [Medida Y]".
         - Demuestra cómo les afecta la situación real.
      
      3. CONCLUSIÓN (Soluciones Globales e Innovadoras + Cierre):
         - Propón una solución concreta (puede ser una iniciativa inventada con nombre propio) que ayude a TODOS los países.
         - DETALLES DE LA SOLUCIÓN: Debes especificar QUÉ es, CÓMO se hará y CON QUÉ FONDOS se financiará.
         - CIERRE: Finaliza con una frase contundente, una pregunta retórica desafiante o una cita que apele a la conciencia de la sala.
      
      TONO Y ESTILO:
      - SIEMPRE habla en TERCERA PERSONA ("La delegación de ${country}", "Esta nación"). NUNCA uses "Yo".
      - SENTIMIENTO: El discurso debe ser emotivo (transmite poder, necesidad, esperanza o indignación) pero manteniendo la rigidez diplomática.
      - Inspírate en la oratoria de altos diplomáticos.
      `;

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      return response.text || "No se pudo generar el discurso.";
    } catch (error) {
      console.error("Error generando discurso:", error);
      throw error;
    }
  }
};
