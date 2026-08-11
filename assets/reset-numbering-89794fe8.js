document.addEventListener("DOMContentLoaded", () => {

    const toc = document.querySelector(".chapter");

    if (!toc) return;

    function numberSection(section, prefix) {

        let counter = 0;

        for (const item of section.children) {

            const link = item.querySelector(":scope > a");

            if (!link) continue;

            counter++;

            const number = `${prefix}.${counter}`;

            if (!link.dataset.numbered) {
                link.textContent =
                    `${number}. ${link.textContent}`;
                link.dataset.numbered = "true";
            }

            const nested =
                item.nextElementSibling?.querySelector(".section");

            if (nested) {
                numberSection(nested, number);
            }
        }
    }

    let insideNumberedPart = false;

    const children = [...toc.children];

    for (let i = 0; i < children.length; i++) {

        const item = children[i];

        if (item.classList.contains("part-title")) {

            const title =
                item.textContent.trim();

            // Ignore Topics section
            if (title === "Topics") {
                insideNumberedPart = false;
                continue;
            }

            insideNumberedPart = true;

            let chapterCounter = 0;

            for (let j = i + 1; j < children.length; j++) {

                const chapter = children[j];

                if (chapter.classList.contains("part-title"))
                    break;

                if (!chapter.classList.contains("chapter-item"))
                    continue;

                const link =
                    chapter.querySelector(":scope > a");

                if (!link) continue;

                chapterCounter++;

                const rootNumber =
                    `${chapterCounter}`;

                if (!link.dataset.numbered) {
                    link.textContent =
                        `${rootNumber}. ${link.textContent}`;
                    link.dataset.numbered = "true";
                }

                const nested =
                    chapter.nextElementSibling?.querySelector(".section");

                if (nested) {
                    numberSection(
                        nested,
                        rootNumber
                    );
                }
            }
        }
    }

});