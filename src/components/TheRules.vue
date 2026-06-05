<template>
    <div class="page">
        <div class="page-header">
            <h1>Zasady</h1>
            <p class="subtitle">Jak działa Liga typerów</p>
        </div>

        <div class="rules-grid">
            <section class="rule-card card">
                <h2 class="section-title">O co chodzi?</h2>
                <p>
                    Typuj wyniki meczów oraz zwycięzcę turnieju. Za trafione prognozy zdobywasz punkty -
                    im więcej, tym wyżej jesteś w rankingu.
                </p>
            </section>

            <section class="rule-card card">
                <h2 class="section-title">Wyniki meczów</h2>
                <p class="rule-intro">Za każdy rozstrzygnięty mecz możesz zdobyć:</p>
                <ul class="points-list">
                    <li class="points-item points-item--exact">
                        <span class="points-badge">3 pkt</span>
                        <span><strong>Dokładny wynik</strong> — trafiasz obie liczby bramek (np. typ 2:1, wynik 2:1).</span>
                    </li>
                    <li class="points-item points-item--correct">
                        <span class="points-badge">1 pkt</span>
                        <span><strong>Poprawny wynik</strong> — trafiasz zwycięzcę lub remis, ale bez dokładnego wyniku (np. typ 2:0, wynik 3:1).</span>
                    </li>
                    <li class="points-item points-item--wrong">
                        <span class="points-badge">0 pkt</span>
                        <span><strong>Błędny typ</strong> — błędny typ.</span>
                    </li>
                </ul>
            </section>

            <section class="rule-card card">
                <h2 class="section-title">Mistrz turnieju</h2>
                <p>
                    Wybierz drużynę, która Twoim zdaniem wygra cały turniej (zakładka
                    <router-link to="/teams">Drużyny</router-link>). Typ musisz złożyć
                    <strong>przed rozpoczęciem turnieju</strong> - po rozpoczęciu pierwszego meczu wybór zostanie zablokowany.
                </p>
                <p class="winner-bonus">
                    <span class="points-badge points-badge--gold">10 pkt</span>
                    za trafienie zwycięzcy turnieju - naliczane po zakończeniu rozgrywek.
                </p>
            </section>

            <section class="rule-card card">
                <h2 class="section-title">Ważne</h2>
                <ul class="rules-list">
                    <li>Typy na mecze składasz po zalogowaniu, zanim rozpocznie się spotkanie.</li>
                    <li>Typ możesz zmienić w dowolnym momencie przed pierwszym gwizdkiem.</li>
                    <li>Typ na mistrza wybierasz w zakładce Drużyny — musisz to zrobić przed rozpoczęciem turnieju.</li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.rules-grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.rule-card {
    padding: 1.5rem;
}

.rule-card p {
    margin: 0 0 0.75rem;
    color: var(--color-text);
    line-height: 1.6;
}

.rule-card p:last-child {
    margin-bottom: 0;
}

.rule-intro {
    margin-bottom: 1rem !important;
    color: var(--color-text-muted);
}

.points-list,
.rules-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.points-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.points-item {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-sm);
    line-height: 1.5;
}

.points-item--exact {
    background: var(--color-exact-bg);
}

.points-item--correct {
    background: var(--color-correct-bg);
}

.points-item--wrong {
    background: var(--color-wrong-bg);
}

.points-badge {
    flex-shrink: 0;
    min-width: 3.25rem;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    text-align: center;
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
}

.points-badge--gold {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
    color: var(--color-primary-dark);
}

.winner-bonus {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.625rem;
    margin-top: 0.5rem !important;
}

.rules-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.rules-list li {
    position: relative;
    padding-left: 1.25rem;
    line-height: 1.55;
    color: var(--color-text);
}

.rules-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-weight: 700;
}

.rule-card a {
    color: var(--color-primary-mid);
    font-weight: 600;
    text-decoration: none;
}

.rule-card a:hover {
    text-decoration: underline;
}
</style>
