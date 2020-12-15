import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TopicNode} from '../../../model/topicnode.model';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {NGXLogger} from "ngx-logger";

@Component({
    templateUrl: 'sendNotification.page.html',
    selector: 'sendNotificationModal'
})
export class SendNotificationModal {
    @Input() topic: TopicNode;

    title: string;
    body: string;
    imageResponse = [];

    options_01 = {
        // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: 4,

        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        width: 1024,
        height: 1024,

        // quality of resized image, defaults to 100
        quality: 75,

        // output type, defaults to FILE_URIs.
        // available options are
        // window.imagePicker.OutputType.FILE_URI (0) or
        // window.imagePicker.OutputType.BASE64_STRING (1)
        outputType: 1
    };

    options_02 = {
        // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: 4,

        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        // width: 200,
        // height: 300,

        // quality of resized image, defaults to 100
        // quality: 75,

        // output type, defaults to FILE_URIs.
        // available options are
        // window.imagePicker.OutputType.FILE_URI (0) or
        // window.imagePicker.OutputType.BASE64_STRING (1)
        outputType: 1
    };

    constructor(private logger: NGXLogger,
                private modalController: ModalController,
                private imagePicker: ImagePicker) {
    }

    public cancel() {
        return this.modalController.dismiss();
    }

    public hasRequiredData(): boolean {
        return this.title != null && this.title.trim().length > 0 && this.body != null && this.body.trim().length > 0;
    }

    getImages(options) {
        this.imageResponse = [];
        this.imagePicker.getPictures(options).then((results) => {
            for (let i = 0; i < results.length; i++) {
                this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
                this.logger.info('Image size ', results[i].length);
            }
        }, (err) => {
            alert(err);
        });
    }

    public send() {
        return this.modalController.dismiss({'title': this.title, 'body': this.body});
    }
}

