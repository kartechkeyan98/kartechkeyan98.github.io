(function () {
    var STORAGE_KEY = 'page-toc-state';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var toc = document.getElementById('page-toc');
        if (!toc) return; // page has no headings, no page-toc on this page

        var titleEl = toc.querySelector('.page-toc-title');

        // ---------- restore saved state ----------
        var state = {};
        try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (e) { state = {}; }

        if (state.left != null && state.top != null) {
            toc.style.left = state.left + 'px';
            toc.style.top = state.top + 'px';
            toc.style.right = 'auto';
        }
        if (state.width) toc.style.width = state.width + 'px';
        if (state.height) toc.style.height = state.height + 'px';
        if (state.hidden) toc.classList.add('page-toc-hidden');

        function saveState() {
            var rect = toc.getBoundingClientRect();
            var next = {
                left: rect.left,
                top: rect.top,
                width: toc.offsetWidth,
                height: toc.offsetHeight,
                hidden: toc.classList.contains('page-toc-hidden')
            };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
        }

        // ---------- dragging ----------
        if (titleEl) {
            var dragging = false, startX, startY, startLeft, startTop;

            titleEl.addEventListener('mousedown', function (e) {
                dragging = true;
                var rect = toc.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                toc.style.right = 'auto';
                toc.classList.add('page-toc-dragging');
                e.preventDefault();
            });

            document.addEventListener('mousemove', function (e) {
                if (!dragging) return;
                var newLeft = startLeft + (e.clientX - startX);
                var newTop = startTop + (e.clientY - startY);

                var maxLeft = window.innerWidth - toc.offsetWidth - 8;
                var maxTop = window.innerHeight - toc.offsetHeight - 8;
                newLeft = Math.min(Math.max(8, newLeft), Math.max(8, maxLeft));
                newTop = Math.min(Math.max(8, newTop), Math.max(8, maxTop));

                toc.style.left = newLeft + 'px';
                toc.style.top = newTop + 'px';
            });

            document.addEventListener('mouseup', function () {
                if (!dragging) return;
                dragging = false;
                toc.classList.remove('page-toc-dragging');
                saveState();
            });
        }

        // ---------- persist native resize ----------
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function () {
                if (!toc.classList.contains('page-toc-dragging')) saveState();
            });
            ro.observe(toc);
        }

        // ---------- toggle button ----------
        var toggleBtn = document.createElement('button');
        toggleBtn.id = 'page-toc-toggle';
        toggleBtn.type = 'button';
        toggleBtn.title = 'Toggle page contents';
        toggleBtn.setAttribute('aria-label', 'Toggle page contents');
        document.body.appendChild(toggleBtn);

        function updateLabel() {
            toggleBtn.textContent = toc.classList.contains('page-toc-hidden') ? '☰' : '✕';
        }
        updateLabel();

        toggleBtn.addEventListener('click', function () {
            toc.classList.toggle('page-toc-hidden');
            updateLabel();
            saveState();
        });
    });
})();