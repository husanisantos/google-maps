class Form extends Map {

    constructor(self) {
        super()
        this.id = self.id
        this.fields = self.fields
        this.title = self.options.form.title
    }

    create() {
        // Crie uma nova div
        const container = document.createElement('div')
        const form      = document.createElement('form') 
        const title     = document.createElement('h3')
        
        container.id    = 'gm-drawing'
        
        
        title.innerText = this.title
        title.classList.add('form-title')
        form.appendChild(title)

        for (const index in this.fields) {
            let inner = document.createElement('div');
            inner.classList.add('form-item'); 

            let label = document.createElement('label');
            label.textContent = this.fields[index];
            label.setAttribute('for', index);
            
            // criar um novo input
            const input = document.createElement('input');
            input.type = 'text';
            input.name = index;
            
            // adicionar o label e o input dentro do div
            
            inner.appendChild(label);
            inner.appendChild(input);
            form.appendChild(inner);

        }

        container.appendChild(form)


        // Selecione o corpo da página
        const body = document.getElementsByTagName('body')[0];

        // Adicione a nova div ao corpo da página
        body.appendChild(container);
    }

    fields() {
        return this.fields
    }

}

export {Form}
