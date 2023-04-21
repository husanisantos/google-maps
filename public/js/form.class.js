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

        this.button('test','Apenas teste')

        for (const index in this.fields) {
            let inner = document.createElement('div');
            inner.classList.add('form-item');
            inner.classList.add(index);

            // criar um novo input
            const input = document.createElement('input');
            input.type = 'text';
            input.name = index;
            input.placeholder = this.fields[index];
            
            // adicionar o label e o input dentro do div
            inner.appendChild(input);
            form.appendChild(inner);

        }



        // Adiciona o botão para salvar
        form.appendChild(this.button('btn-primary', 'Salvar', 'save'))

        // Adiciona o botão para cancelar
        form.appendChild(this.button('btn-danger', 'Remover', 'cancel'))

        // Adiciona o formulário ao container
        container.appendChild(form)

        // Selecione o corpo da página
        const body = document.getElementsByTagName('body')[0];

        // Adicione a nova div ao corpo da página
        body.appendChild(container);
    }

    fields() {
        return this.fields
    }

    button(classes, text = '', id = '', type = 'button') {
        const holder = document.createElement('div')
        const button = document.createElement('button')

        if(id) {
            button.id = id;
        }

        holder.classList.add('form-item')
        button.classList.add(classes)
        button.setAttribute('type', type)
        button.innerText = text
        holder.appendChild(button)

        return holder
    }

}

export {Form}
