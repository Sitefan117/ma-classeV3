<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudentName, submitActivityResult } from '$lib/client/activity';

  type Screen = 'home' | 'cv' | 'letter';
  type CvFields = {
    perso: string;
    accroche: string;
    ecole: string;
    stages: string;
    langues: string;
    info: string;
    hobbies: string;
    references: string;
  };
  type LetterFields = {
    exp: string;
    dest: string;
    date: string;
    objet: string;
    appel: string;
    p1: string;
    p2: string;
    p3: string;
    sig: string;
  };

  type ChatMessage = { role: 'user' | 'assistant'; content: string };

  let studentName = 'Explorateur';
  let screen: Screen = 'home';
  
  // Gestion de l'affichage des ressources de la lettre
  let letterTab: 'examples' | 'chatbot' = 'chatbot'; 
  let activeLetterExample: number | null = null;
  let letterSide: 'left' | 'right' = 'left'; // Choix du côté de la feuille pour l'élève

  let completionMessage = '';
  let cv: CvFields = { perso: '', accroche: '', ecole: '', stages: '', langues: '', info: '', hobbies: '', references: '' };
  let letter: LetterFields = { exp: '', dest: '', date: '', objet: '', appel: 'Madame, Monsieur,', p1: '', p2: '', p3: '', sig: '' };

  // Variables pour le chatbot local
  let chatInput = '';
  let chatHistory: ChatMessage[] = [];
  let isChatLoading = false;

  const cvExamples = [
    `[DONNÉES PERSONNELLES]\nJulien Favre\nChemin des Epinettes 4\n1964 Conthey\n079 023 85 96\n\n[ACCROCHE]\nFiable, motivé, autonome et curieux, je recherche une place d’apprentissage d’agent d’exploitation.\n\n[STAGE]\nAgent d’exploitation, Service de la propreté urbaine : entretien, plantation, machines.`,
    `[DONNÉES PERSONNELLES]\nDaniela Fontana\n1095 Lutry\n\n[ACCROCHE]\nJe recherche une place d’apprentissage d’assistante médicale. Je suis fiable et j’ai un bon contact avec les gens.\n\n[STAGES]\nClinique dentaire, centre de soins, pharmacie.`,
    `[DONNÉES PERSONNELLES]\nAndrea Seferovic\n2800 Delémont\n\n[ACCROCHE]\nObjectif : apprentissage de spécialiste en restauration. Attentive, aimable et sérieuse.\n\n[INTÉRÊTS]\nDanse hip-hop, natation, recherches Internet.`
  ];

  // Exemples structurés pour une vraie mise en page courrier
  const structuredLetters = [
    {
      exp: "Julie Cordonier\nRue des Alpes 12\n1950 Sion",
      dest: "Garage du Centre\nResponsable RH\nRoute de la Gare 5\n1950 Sion",
      date: "Sion, le 9 juillet 2026",
      objet: "Objet : Candidature à une place d'apprentissage de mécanicienne en maintenance d'automobiles CFC",
      p1: "Je vous fais parvenir mon dossier de candidature afin de postuler pour la place d'apprentissage mentionnée ci-dessus.",
      p2: "Passionnée par la mécanique depuis mon enfance, j'ai eu l'opportunité d'effectuer un stage de trois jours dans un garage. Ce contact direct avec l'atelier a confirmé mon envie d'exercer ce métier technique.",
      p3: "Précise, motivée et investie, je serais ravie de vous rencontrer lors d'un entretien pour vous exposer mes motivations de vive voix.",
      sig: "Julie Cordonier"
    },
    {
      exp: "Daniela Fontana\nRoute du Lac 45\n1095 Lutry",
      dest: "Cabinet Médical des Vignes\nDr. M. Bernard\nGrand-Rue 2\n1009 Pully",
      date: "Lutry, le 9 juillet 2026",
      objet: "Objet : Candidature à une place d'apprentissage d'assistante médicale CFC",
      p1: "Actuellement en fin de scolarité obligatoire, je me permets de vous soumettre ma candidature pour l'apprentissage d'assistante médicale au sein de votre cabinet.",
      p2: "Le domaine de la santé m'attire particulièrement et j'apprécie beaucoup le contact humain. Un stage d'observation chez un pédiatre m'a permis de comprendre l'importance de l'accueil des patients et de la gestion administrative.",
      p3: "Souriante, organisée et dotée d'une grande écoute, j'espère que mon dossier retiendra votre attention pour un prochain stage ou entretien.",
      sig: "Daniela Fontana"
    }
  ];

  onMount(() => {
    studentName = getStudentName();
    const savedCv = localStorage.getItem('pcp_cv_v1');
    const savedLetter = localStorage.getItem('pcp_letter_v1');
    if (savedCv) cv = { ...cv, ...(JSON.parse(savedCv) as Partial<CvFields>) };
    if (savedLetter) letter = { ...letter, ...(JSON.parse(savedLetter) as Partial<LetterFields>) };
  });

  function saveCv() { localStorage.setItem('pcp_cv_v1', JSON.stringify(cv)); }
  function saveLetter() { localStorage.setItem('pcp_letter_v1', JSON.stringify(letter)); }

  function loadLetterExample(index: number) {
    activeLetterExample = index;
    const ex = structuredLetters[index];
    // Remplissage automatique optionnel si l'élève veut s'en inspirer directement
    if(confirm("Veux-tu copier la structure de cet exemple dans ta zone de rédaction ? (Attention, cela remplacera ton texte actuel)")) {
      letter = { ...ex, appel: "Madame, Monsieur," };
      saveLetter();
    }
  }

  // Envoi de la demande au chatbot local via notre route API
  async function sendChatMessage() {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    chatHistory = [...chatHistory, { role: 'user', content: userMessage }];
    chatInput = '';
    isChatLoading = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: chatHistory.slice(0, -1) })
      });

      if (response.ok) {
        const data = await response.json();
        chatHistory = [...chatHistory, { role: 'assistant', content: data.response }];
      } else {
        chatHistory = [...chatHistory, { role: 'assistant', content: '❌ Impossible de joindre l\'assistant. Vérifie qu\'Ollama tourne bien en local.' }];
      }
    } catch (e) {
      chatHistory = [...chatHistory, { role: 'assistant', content: '❌ Erreur de connexion avec le serveur local.' }];
    } finally {
      isChatLoading = false;
    }
  }

  async function markComplete(kind: 'CV' | 'Lettre de motivation') {
    const report = await submitActivityResult({
      studentName,
      world: 'pcp',
      mission: kind,
      score: 1,
      total: 1,
      scoreBasis: 'last',
      errorCount: 0,
      metadata: { completedAt: new Date().toISOString() }
    });
    completionMessage = report.message;
  }
</script>

<svelte:head>
  <title>Espace PCP / Orientation — Classe Numérique</title>
</svelte:head>

<div class="page">
  <header class="header" style="background: #1e3a8a;">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-icon">💼</span>
        <div>
          <h1 class="brand-title">Espace PCP / Orientation</h1>
          <p class="brand-subtitle">Dossier professionnel de {studentName}</p>
        </div>
      </div>
      <a class="btn ghost" href="/">↩ QG</a>
    </div>
  </header>

  <main class="main stack">
    {#if screen === 'home'}
      <!-- ÉCRAN D'ACCUEIL DU MODULE -->
      <section class="card stack center" style="max-width: 48rem; margin: 3rem auto;">
        <h2>Préparation au Choix Professionnel</h2>
        <p class="muted">Construis pas à pas tes documents de candidature professionnels.</p>
        <div class="grid world-grid">
          <button class="card stack center" type="button" on:click={() => (screen = 'cv')}>
            <span style="font-size: 3rem;">📝</span>
            <strong>Créer mon CV</strong>
            <span class="muted small">Rédige les bases de ton futur CV.</span>
          </button>
          <button class="card stack center" type="button" on:click={() => (screen = 'letter')}>
            <span style="font-size: 3rem;">✉️</span>
            <strong>Écrire ma Lettre de Motivation</strong>
            <span class="muted small">Bénéficie de l'aide d'un assistant IA personnalisé et de vrais modèles.</span>
          </button>
        </div>
      </section>

    {:else if screen === 'cv'}
      <!-- SECTION CV (Laissé intact pour préserver ton travail original) -->
      <section class="stack">
        <div class="mission-top no-print">
          <button class="btn secondary" type="button" on:click={() => (screen = 'home')}>⬅ Retour</button>
          <div class="actions">
            {#each cvExamples as example, index}<button class="btn secondary" type="button" on:click={() => (cvExample = example)}>Exemple {index + 1}</button>{/each}
            <button class="btn good" type="button" on:click={() => window.print()}>📥 Imprimer</button>
            <button class="btn primary" type="button" on:click={() => markComplete('CV')}>✅ CV terminé</button>
          </div>
        </div>
        {#if completionMessage}<p class="feedback good no-print">{completionMessage}</p>{/if}
        <div class="split">
          <div class="pcp-sheet">
            <div class="pcp-grid two">
              <div class="stack">
                <h3>Données personnelles</h3>
                <textarea class="pcp-field" bind:value={cv.perso} on:input={saveCv} placeholder="Coordonnées..."></textarea>
                <h3>Langues</h3><textarea class="pcp-field" bind:value={cv.langues} on:input={saveCv} placeholder="Langues..."></textarea>
                <h3>Informatique</h3><textarea class="pcp-field" bind:value={cv.info} on:input={saveCv} placeholder="Logiciels..."></textarea>
                <h3>Centres d’intérêts</h3><textarea class="pcp-field" bind:value={cv.hobbies} on:input={saveCv} placeholder="Hobbies..."></textarea>
              </div>
              <div class="stack">
                <textarea class="pcp-field" style="font-style: italic;" bind:value={cv.accroche} on:input={saveCv} placeholder="Accroche..."></textarea>
                <h3>Scolarité</h3><textarea class="pcp-field" bind:value={cv.ecole} on:input={saveCv} placeholder="Scolarité..."></textarea>
                <h3>Stages d’observation</h3><textarea class="pcp-field" bind:value={cv.stages} on:input={saveCv} placeholder="Stages..."></textarea>
                <h3>Références</h3><textarea class="pcp-field" bind:value={cv.references} on:input={saveCv} placeholder="Références..."></textarea>
              </div>
            </div>
          </div>
          {#if cvExample}<aside class="example-panel no-print">⬅️ Modèle\n\n{cvExample}</aside>{/if}
        </div>
      </section>

    {:else}
      <!-- SECTION LETTRE DE MOTIVATION (Nouveau Double Écran Connecté) -->
      <section class="stack">
        <div class="mission-top no-print" style="background: #1e293b; padding: 1rem; border-radius: 0.75rem;">
          <button class="btn secondary" type="button" on:click={() => (screen = 'home')}>⬅ Menu Principal</button>
          
          <div class="flex gap-2">
            <button class="btn ghost" type="button" on:click={() => letterSide = letterSide === 'left' ? 'right' : 'left'}>
              🔄 Feuille à : {letterSide === 'left' ? 'Gauche' : 'Droite'}
            </button>
            <button class="btn good" type="button" on:click={() => window.print()}>📥 Générer PDF / Imprimer</button>
            <button class="btn primary" type="button" on:click={() => markComplete('Lettre de motivation')}>✅ Soumettre au Maître</button>
          </div>
        </div>

        {#if completionMessage}<p class="feedback good no-print">{completionMessage}</p>{/if}

        <!-- Conteneur Double Écran (L'ordre s'inverse selon la variable letterSide) -->
        <div class="split" style="display: flex; gap: 1.5rem; flex-direction: {letterSide === 'left' ? 'row' : 'row-reverse'};">
          
          <!-- LA FEUILLE DE RÉDACTION DE L'ÉLÈVE -->
          <div class="pcp-sheet stack" style="flex: 1; background: #ffffff; color: #1e293b; padding: 2.5rem; border-radius: 0.5rem; shadow: xl; border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; color: #94a3b8; font-weight: bold; margin-bottom: 1rem;" class="no-print">📝 ZONE DE RÉDACTION (STYLE COURRIER SUISSE)</div>
            
            <textarea class="pcp-field-clean" style="width: 50%; font-family: sans-serif;" bind:value={letter.exp} on:input={saveLetter} placeholder="Prénom Nom&#10;Adresse&#10;N° de Téléphone&#10;Email"></textarea>
            <textarea class="pcp-field-clean" style="width: 50%; margin-left: auto; font-family: sans-serif; margin-top: 1rem;" bind:value={letter.dest} on:input={saveLetter} placeholder="Nom de l'entreprise&#10;À l'attention de M./Mme X&#10;Adresse de la boîte"></textarea>
            <textarea class="pcp-field-clean" style="text-align: right; margin-top: 1.5rem; font-family: sans-serif;" bind:value={letter.date} on:input={saveLetter} placeholder="Lieu, le date du jour"></textarea>
            <textarea class="pcp-field-clean" style="font-weight: bold; margin-top: 1rem; font-family: sans-serif;" bind:value={letter.objet} on:input={saveLetter} placeholder="Objet : Candidature à une place d'apprentissage de..."></textarea>
            
            <input class="pcp-input-clean" style="margin-top: 1.5rem; font-family: sans-serif;" bind:value={letter.appel} on:input={saveLetter} placeholder="Madame, Monsieur," />
            
            <textarea class="pcp-field-clean paragraph-field" bind:value={letter.p1} on:input={saveLetter} placeholder="[MOI] : Pourquoi j'écris ? Quel est mon projet actuel ? (Ex: Actuellement en fin de scolarité à la recherche d'un défi...)"></textarea>
            <textarea class="pcp-field-clean paragraph-field" bind:value={letter.p2} on:input={saveLetter} placeholder="[VOUS] : Pourquoi cette entreprise et ce métier ? Qu'est-ce qui me plaît ? (Explique tes stages d'observation d'agent d'exploitation, de mécanique...)"></textarea>
            <textarea class="pcp-field-clean paragraph-field" bind:value={letter.p3} on:input={saveLetter} placeholder="[NOUS] : Quelles sont mes forces ? Qu'est-ce que je demande ? (Ma rigueur, mon esprit d'équipe, demande d'entretien ou de stage d'évaluation...)"></textarea>
            
            <textarea class="pcp-field-clean" style="width: 50%; margin-left: auto; margin-top: 2rem; text-align: right; font-family: sans-serif;" bind:value={letter.sig} on:input={saveLetter} placeholder="Formule de salutation & Signature"></textarea>
          </div>

          <!-- LE PANNEAU DE DROITE : OUTILS ET RESSOURCES (CHATBOT / EXEMPLES) -->
          <div class="resource-panel no-print" style="flex: 1; display: flex; flex-direction: column; background: #0f172a; border-radius: 0.5rem; border: 1px solid #334155; overflow: hidden; min-height: 600px;">
            
            <!-- Onglets de sélection de l'outil -->
            <div class="tabs-header" style="display: flex; background: #1e293b; border-b: 1px solid #334155;">
              <button class="tab-btn" style="flex: 1; padding: 1rem; color: white; font-weight: bold; background: {letterTab === 'chatbot' ? '#0f172a' : 'transparent'}; border: none;" on:click={() => letterTab = 'chatbot'}>
                💬 Assistant IA (Ollama)
              </button>
              <button class="tab-btn" style="flex: 1; padding: 1rem; color: white; font-weight: bold; background: {letterTab === 'examples' ? '#0f172a' : 'transparent'}; border: none;" on:click={() => letterTab = 'examples'}>
                📋 Exemples Classiques
              </button>
            </div>

            <div class="tab-content" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; overflow-y: auto;">
              
              {#if letterTab === 'chatbot'}
                <!-- INTERFACE CHATBOT OLLAMA -->
                <div class="chat-container" style="display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                  <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem; font-style: italic;">
                    Besoin d'aide pour formuler une phrase ou parler de tes stages ? Pose tes questions à l'assistant d'orientation.
                  </p>

                  <div class="chat-messages" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; max-height: 400px; padding-right: 0.5rem;">
                    {#if chatHistory.length === 0}
                      <div class="msg bot-msg" style="background: #1e293b; padding: 0.75rem 1rem; border-radius: 0.5rem; max-width: 85%; color: #e2e8f0; align-self: flex-start;">
                        Bonjour {studentName} ! Je suis ton assistant d'orientation. Par quel paragraphe de ta lettre aimerais-tu commencer ? Raconte-moi quel métier tu as envie de faire !
                      </div>
                    {/if}

                    {#each chatHistory as msg}
                      <div class="msg {msg.role}-msg" style="padding: 0.75rem 1rem; border-radius: 0.5rem; max-width: 85%; line-height: 1.4; text-align: left;
                        background: {msg.role === 'user' ? '#2563eb' : '#1e293b'};
                        color: white;
                        align-self: {msg.role === 'user' ? 'flex-end' : 'flex-start'};">
                        {msg.content}
                      </div>
                    {/each}

                    {#if isChatLoading}
                      <div class="msg bot-msg" style="background: #1e293b; padding: 0.75rem 1rem; border-radius: 0.5rem; max-width: 80%; color: #94a3b8; align-self: flex-start; font-style: italic;">
                        ⚡ L'assistant analyse et formule une idée...
                      </div>
                    {/if}
                  </div>

                  <div class="chat-input-area" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <input type="text" bind:value={chatInput} on:keydown={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Pose ta question ici (ex: comment dire que j'aime trier ?)" 
                           style="flex: 1; padding: 0.75rem; border-radius: 0.375rem; background: #1e293b; border: 1px solid #475569; color: white;" />
                    <button class="btn primary" type="button" on:click={sendChatMessage} style="padding: 0.75rem 1.2rem;">Envoyer</button>
                  </div>
                </div>

              {:else}
                <!-- INTERFACE EXEMPLES TYPE COURRIER PRO -->
                <div class="examples-container stack" style="gap: 1rem;">
                  <div class="flex gap-2">
                    <button class="btn secondary small" class:active={activeLetterExample === 0} type="button" on:click={() => loadLetterExample(0)}>Exemple 1 : Mécanique</button>
                    <button class="btn secondary small" class:active={activeLetterExample === 1} type="button" on:click={() => loadLetterExample(1)}>Exemple 2 : Médical</button>
                  </div>

                  {#if activeLetterExample !== null}
                    {@const ex = structuredLetters[activeLetterExample]}
                    <div class="visual-letter-mockup" style="background: white; color: #334155; padding: 1.5rem; border-radius: 0.375rem; font-size: 0.75rem; box-shadow: inner; font-family: monospace; line-height: 1.3;">
                      <div style="white-space: pre-line; color: #64748b;">{ex.exp}</div>
                      <div style="white-space: pre-line; margin-left: auto; width: 60%; text-align: left; margin-top: 0.5rem; color: #64748b;">{ex.dest}</div>
                      <div style="text-align: right; margin-top: 0.5rem; font-weight: bold;">{ex.date}</div>
                      <div style="font-weight: bold; margin-top: 0.5rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.25rem;">{ex.objet}</div>
                      <div style="margin-top: 0.5rem; font-style: italic;">Madame, Monsieur,</div>
                      <div style="margin-top: 0.5rem; text-indent: 1rem;">{ex.p1}</div>
                      <div style="margin-top: 0.5rem; text-indent: 1rem; background: #f8fafc; border-left: 2px solid #38bdf8; padding: 0.25rem;">{ex.p2}</div>
                      <div style="margin-top: 0.5rem; text-indent: 1rem;">{ex.p3}</div>
                      <div style="text-align: right; margin-top: 1rem; font-weight: bold; color: #64748b;">{ex.sig}</div>
                    </div>
                  {:else}
                    <p style="color: #94a3b8; text-align: center; margin-top: 3rem;">Clique sur un exemple pour voir sa mise en page suisse.</p>
                  {/if}
                </div>
              {/if}

            </div>
          </div>

        </div>
      </section>
    {/if}
  </main>
</div>

<style>
  /* Styles épurés pour la feuille blanche de style courrier sans casser tes inputs existants */
  .pcp-field-clean {
    display: block;
    width: 100%;
    background: transparent;
    border: 1px transparent solid;
    color: #1e293b;
    resize: none;
    font-size: 0.9rem;
    padding: 0.25rem;
    line-height: 1.5;
  }
  .pcp-field-clean:hover {
    border: 1px dotted #cbd5e1;
    background: #f8fafc;
  }
  .pcp-field-clean:focus {
    border: 1px solid #3b82f6;
    background: #fff;
    outline: none;
  }
  .pcp-input-clean {
    width: 100%;
    background: transparent;
    border: none;
    font-size: 0.9rem;
    font-weight: bold;
    color: #1e293b;
    padding: 0.25rem 0;
  }
  .paragraph-field {
    margin-top: 1.25rem;
    min-height: 4.5rem;
    text-indent: 1.5rem;
  }
  .tab-btn:hover {
    background: #1e293b !important;
    cursor: pointer;
  }
  .small {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  .active {
    background: #2563eb !important;
    color: white !important;
  }

  /* Cache les ressources lors de l'impression réelle pour avoir une vraie page A4 propre */
  @media print {
    .no-print {
      display: none !important;
    }
    .page {
      background: white !important;
      padding: 0 !important;
    }
    .pcp-sheet {
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      width: 100% !important;
    }
  }
</style>
