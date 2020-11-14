import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageIdToLinkPipe } from '../../models/pipes/imageIdToLink.pipe';

@Component({
  selector: 'app-file-upload-input',
  templateUrl: './file-upload-input.component.html',
  styleUrls: ['./file-upload-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FileUploadInputComponent)
    }
  ]
})

export class FileUploadInputComponent implements OnInit, ControlValueAccessor {

  @Input('type') public type: 'square' | 'offer' | 'mobileLanding' | 'desktopLanding' | 'avatar' = 'square';
  @Input('src') public src = '';

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  public imgUrl: string;
  public value: string;
  public empty: boolean = true;

  constructor() {
  }

  ngOnInit() {
    if (this.src.length > 0) {
      this.imgUrl = `url(${this.src})`;
      this.empty = false;
    } else {
      this.imgUrl = `url(assets/images/no-image-plus.png)`;
    }
  }

  private onChange: (data: string) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(img: string): void {

    this.value = img;

    if (!img) {
      return;
    } else if (img.length == 32) {
      this.imgUrl = `url(${new ImageIdToLinkPipe().transform(this.value, this.type || 'fileUpload')})`;
    }

    this.onTouched();
  }

  private async handleFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    let result = '';

    let max_width;
    let max_height;

    switch (this.type) {
      case 'avatar': {
        max_width = 200;
        max_height = 200;
        break;
      }
      case 'desktopLanding': {
        max_width = 282;
        max_height = 187;
        break;
      }
      case 'mobileLanding': {
        max_width = 215;
        max_height = 315;
        break;
      }
      case 'offer': {
        max_width = 250;
        max_height = 250;
        break;
      }
      case 'square': {
        max_width = 250;
        max_height = 250;
        break;
      }
      default: {
        max_width = 250;
        max_height = 250;
        break;
      }
    }

    reader.onload = (_event) => {

      let imageLoaded = new EventEmitter();

      // resize item

      const imgElement = document.createElement('img');
      imgElement.src = _event.target['result'];

      imgElement.onload = (e) => {
        const canvas = document.createElement('canvas');

        const ctx = canvas.getContext('2d');

        let scale = max_width / e.target['width'];

        canvas.width = max_width;
        canvas.height = scale * e.target['height'];

        if (canvas.height > max_height) {
          scale = max_height / canvas.height;

          canvas.width = scale * max_width;
          canvas.height = max_height;
        }

        ctx.drawImage(<any> e.target, 0, 0, canvas.width, canvas.height);
        result = ctx.canvas.toDataURL('image/png', 1);
        imageLoaded.emit(result);
      };

      imageLoaded.subscribe((result) => {

        this.imgUrl = `url(${result})`;
        this.value = result.toString();

        this.onChange(this.value);
        this.onTouched();

      });
    };
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onFileDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    let imageFile = event.dataTransfer.files[0];

    this.handleFile(imageFile);
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      let imageFile = event.target.files[0];
      this.handleFile(imageFile);
    }
  }

  public openFileDialog(): void {
    let event = new MouseEvent('click', {bubbles: false});
    this.fileInput.nativeElement.dispatchEvent(event);
  }
}
