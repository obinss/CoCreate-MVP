/* ============================================
   CoCreate Platform - Component Library
   Reusable UI components for consistent design
   ============================================ */

const ComponentLibrary = {

    // === Skeleton Loaders ===
    skeleton: {
        text(width = '100%', height = '1rem') {
            return `<div class="skeleton skeleton-text" style="width: ${width}; height: ${height};"></div>`;
        },
        circle(size = '48px') {
            return `<div class="skeleton skeleton-circle" style="width: ${size}; height: ${size};"></div>`;
        },
        rect(width = '100%', height = '200px') {
            return `<div class="skeleton skeleton-rect" style="width: ${width}; height: ${height};"></div>`;
        },
        card() {
            return `
                <div class="card skeleton-card">
                    ${this.rect('100%', '180px')}
                    <div style="padding: 16px;">
                        ${this.text('60%', '1.25rem')}
                        ${this.text('100%', '0.9rem')}
                        ${this.text('80%', '0.9rem')}
                        <div style="margin-top: 16px; display: flex; justify-content: space-between;">
                            ${this.text('30%', '1.5rem')}
                            ${this.text('20%', '1rem')}
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // === Progress Bar ===
    progressBar(value, max = 100, color = 'var(--color-primary)') {
        const percent = Math.min((value / max) * 100, 100);
        return `
            <div class="progress-bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}">
                <div class="progress-bar-fill" style="width: ${percent}%; background: ${color};"></div>
            </div>
        `;
    },

    // === Avatar ===
    avatar(name, size = 'md', imageUrl = null) {
        const sizes = { sm: '32px', md: '48px', lg: '64px', xl: '96px' };
        const fontSizes = { sm: '0.8rem', md: '1rem', lg: '1.5rem', xl: '2rem' };
        const sizeVal = sizes[size] || sizes.md;
        const fontSize = fontSizes[size] || fontSizes.md;
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        if (imageUrl) {
            return `<img src="${imageUrl}" alt="${name}" class="avatar" style="width: ${sizeVal}; height: ${sizeVal};">`;
        }
        return `
            <div class="avatar avatar-initials" style="width: ${sizeVal}; height: ${sizeVal}; font-size: ${fontSize};">
                ${initials}
            </div>
        `;
    },

    // === Empty State ===
    emptyState(icon, title, description, actionLabel = null, actionHandler = null) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h3 class="empty-state-title">${title}</h3>
                <p class="empty-state-description">${description}</p>
                ${actionLabel ? `<button class="btn btn-primary" onclick="${actionHandler}">${actionLabel}</button>` : ''}
            </div>
        `;
    },

    // === Stat Card ===
    statCard(label, value, icon = null, trend = null) {
        const trendHtml = trend ? `
            <span class="stat-trend ${trend > 0 ? 'positive' : 'negative'}">
                ${trend > 0 ? '↑' : '↓'} ${Math.abs(trend)}%
            </span>
        ` : '';

        return `
            <div class="stat-card">
                ${icon ? `<div class="stat-icon">${icon}</div>` : ''}
                <div class="stat-content">
                    <div class="stat-label">${label}</div>
                    <div class="stat-value">${value}</div>
                    ${trendHtml}
                </div>
            </div>
        `;
    },

    // === Breadcrumbs ===
    breadcrumbs(items) {
        return `
            <nav class="breadcrumbs" aria-label="Breadcrumb">
                <ol>
                    ${items.map((item, i) => `
                        <li ${i === items.length - 1 ? 'aria-current="page"' : ''}>
                            ${item.href ? `<a href="#" onclick="${item.onclick || `navigate('${item.href}')`}">${item.label}</a>` : item.label}
                        </li>
                    `).join('<li class="breadcrumb-separator">/</li>')}
                </ol>
            </nav>
        `;
    },

    // === Tooltip Wrapper ===
    tooltip(content, text, position = 'top') {
        return `
            <span class="tooltip-wrapper" data-tooltip="${text}" data-position="${position}">
                ${content}
            </span>
        `;
    },

    // === Chip/Tag ===
    chip(label, removable = false, onRemove = null) {
        return `
            <span class="chip">
                ${label}
                ${removable ? `<button class="chip-remove" onclick="${onRemove}">×</button>` : ''}
            </span>
        `;
    },

    // === Accordion ===
    accordion(items) {
        return `
            <div class="accordion">
                ${items.map((item, i) => `
                    <details class="accordion-item" ${item.open ? 'open' : ''}>
                        <summary class="accordion-header">${item.title}</summary>
                        <div class="accordion-content">${item.content}</div>
                    </details>
                `).join('')}
            </div>
        `;
    },

    // === Stepper ===
    stepper(steps, currentStep) {
        return `
            <div class="stepper">
                ${steps.map((step, i) => `
                    <div class="stepper-item ${i < currentStep ? 'completed' : ''} ${i === currentStep ? 'active' : ''}">
                        <div class="stepper-indicator">
                            ${i < currentStep ? '✓' : i + 1}
                        </div>
                        <div class="stepper-label">${step}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

window.ComponentLibrary = ComponentLibrary;
