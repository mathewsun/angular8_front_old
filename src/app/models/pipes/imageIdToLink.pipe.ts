import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'imageIdToLink'
})
export class ImageIdToLinkPipe implements PipeTransform {
  transform(imageId: string, imageType: string = "placeholder"): string {
    let result: string;

    if (imageId)
      result = `http://${ENVIRONMENT.API_HOST}/image/${imageId}`;
    else {
      switch (imageType) {
        case 'square':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'fileUpload':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'avatar':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'offer':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'mobileLanding':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'desktopLanding':
          result = 'assets/images/no-image-plus.png';
          break;
        case 'placeholder':
          result = 'assets/images/no-image-square_small.png';
          break;
        default:
          result = 'assets/images/no-image-square_small.png'
      }
    }

    return result;
  }
}
