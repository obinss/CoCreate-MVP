/**
 * Component Loader
 * Fetches and injects shared HTML components (Navbar, Footer)
 * and executes any embedded scripts.
 */

async function loadComponents() {
    await loadComponent('navbar-placeholder', 'src/components/navbar.html');
    // Load navbar script after component is loaded
    await loadExternalScript('src/scripts/navbar.js');

    await loadComponent('footer-placeholder', 'src/components/footer.html');
}

async function loadComponent(placeholderId, path) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(path);
        const html = await response.text();

        // Create a temporary container
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Extract scripts
        const scripts = Array.from(temp.querySelectorAll('script'));
        scripts.forEach(script => script.remove());

        // Insert HTML
        placeholder.innerHTML = temp.innerHTML;

        // Execute scripts
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
        });

    } catch (error) {
        console.error(`Error loading component from ${path}:`, error);
    }
}

// Helper to load external scripts
async function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

// Auto-load on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadComponents);
