var module = module || {};
module['ui'] = {
    LoadProgressBar : {
        ProgressElement : document.createElement('DIV'),
        Initialize() {
            this.ProgressElement.style = `position: fixed; top: 0px;
            left: 0px; height:0.1em; width: 0px; background-color:#1e88e5;
            z-index:300;`;
            document.body.appendChild(this.ProgressElement);
        },
        Start() {
            this.ProgressElement.style['width'] = '1%'
            
        },
        End() {
            setTimeout(() => this.ProgressElement.style['width'] = '0px', 500);
        },
        Update(percent) {
            this.ProgressElement.style['width'] = percent+'%';
        }
    },

    Toast(text, time = 1500,position = 'bottom-start', icon = null) {
        if(icon == null)
            swal.fire({
                width: 300,
                position: position,
                text: text,
                showConfirmButton: false,
                timer: time
            });
        else
            swal.fire({
                width: 300,
                position: position,
                text: text,
                icon: icon,
                showConfirmButton: false,
                timer: time
            });
    }
}