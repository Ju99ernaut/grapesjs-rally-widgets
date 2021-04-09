export default (editor, opts = {}) => {
    const cm = editor.Commands;
    const $ = editor.$;
    const pfx = editor.getConfig('stylePrefix');
    const modal = editor.Modal;
    const codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
    const container = $('<div></div>');
    let importLabel = 'HTML';
    let viewerEditor = codeViewer.editor;

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    // Init import button
    const btnCopy = $(`<button title="Copy" class="gjs-copy-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-3-4H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"></path></svg>
    </button>`);
    btnCopy.on('click', e => {
        const val = viewerEditor.getValue().trim();
        // Add to clipboard
        const iconOrig = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21H8V7h11m0-2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-3-4H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"></path></svg>';
        const iconDone = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"></path></svg>';
        copyToClipboard(val);
        btnCopy.html(iconDone);
        setTimeout(() => btnCopy.html(iconOrig), 2000);
    });

    // Init label
    const labelEl = $(`<div class="${pfx}import-label">${importLabel}</div>`);

    // Init code viewer
    codeViewer.set({
        ...{
            codeName: 'htmlmixed',
            theme: 'hopscotch',
            autoBeautify: 1,
            autoCloseTags: 1,
            autoCloseBrackets: 1,
            styleActiveLine: 1,
            smartIndent: 1,
            readOnly: 1,
        },
        ...opts.copyViewerOptions
    });

    const getCode = () => {
        const component = editor.getSelected();
        const html = component.toHTML();
        const css = editor.CodeManager.getCode(component, 'css', {
            cssc: editor.CssComposer
        });
        const js = `
                var el = document.querySelector(#${component.ccid});
                var props = ${JSON.stringify(editor.getSelected().__getScriptProps())};
                (${component.getScriptString()}.bind(el))(props);
            `;
        return `${html}<style>\n${css}</style><script>\n${js}</script>`;
    }

    cm.add('widget-code', {
        run(editor) {
            if (!viewerEditor) {
                const txtarea = document.createElement('textarea');
                container.append(labelEl);
                container.append(txtarea);
                container.append(btnCopy);
                codeViewer.init(txtarea);
                viewerEditor = codeViewer.editor;
            }

            modal.setTitle(opts.modalCopyTitle);
            modal.setContent(container);
            codeViewer.setContent(getCode());
            modal.open().getModel()
                .once('change:open', () => editor.stopCommand(this.id));
            viewerEditor.refresh();
        },

        stop() {
            modal.close();
        }
    });
}