document.addEventListener("DOMContentLoaded", () => {

    const headings = document.querySelectorAll(
        ".content h1[id], .content h2[id], .content h3[id]"
    );

    if (headings.length === 0)
        return;

    const toc = document.createElement("div");
    toc.id = "page-toc";

    const title = document.createElement("div");
    title.className = "page-toc-title";
    title.textContent = "Contents";

    toc.appendChild(title);

    const rootList = document.createElement("ul");

    let currentH1 = null;
    let currentH2 = null;

    headings.forEach(h => {

        const level =
            parseInt(h.tagName.substring(1));

        const li = document.createElement("li");

        const a = document.createElement("a");

        a.href = "#" + h.id;

        a.textContent =
            h.textContent
             .replace(/\s+/g, " ")
             .trim();

        li.appendChild(a);

        if (level === 1) {

            rootList.appendChild(li);

            const subList =
                document.createElement("ul");

            li.appendChild(subList);

            currentH1 = subList;
            currentH2 = null;
        }

        else if (level === 2) {

            if (!currentH1) {
                rootList.appendChild(li);
                return;
            }

            currentH1.appendChild(li);

            const subList =
                document.createElement("ul");

            li.appendChild(subList);

            currentH2 = subList;
        }

        else if (level === 3) {

            if (!currentH2) {

                if (currentH1)
                    currentH1.appendChild(li);
                else
                    rootList.appendChild(li);

                return;
            }

            currentH2.appendChild(li);
        }

    });

    toc.appendChild(rootList);

    document.body.appendChild(toc);

});