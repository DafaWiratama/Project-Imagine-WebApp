import {Component, Injectable, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-upscaler',
  templateUrl: './upscaler.component.html',
  styleUrls: ['./upscaler.component.scss']
})
export class UpscalerComponent implements OnInit {
  file: File | null = null;

  img: string | ArrayBuffer | null = null
  is_loading: boolean = false
  file_url: SafeResourceUrl | null = null
  error_message: string | null = null

  constructor(private fileUploadService: FileUploadService, private sanitizer: DomSanitizer) {
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.img = reader.result;
    if(this.file != null){
      this.img_up_scaled = null
      reader.readAsDataURL(this.file as File);
      this.error_message = null
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.img_up_scaled = reader.result;
      this.file_url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(image));
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  model = 'gan'
  noise_reduction = 'True'

  onUpload() {
    this.is_loading = !this.is_loading;
    this.fileUploadService.upload(this.file, this.model, this.noise_reduction).subscribe(
      (event: any) => {
        if (event.type == 'application/json') {
          this.error_message = 'Sadly we cannot process such a huge file at the moment because of Hardware Limitation :( Maximum Allowed Resolution is (512, 512)'
          this.is_loading = false
          return
        }
        this.createImageFromBlob(event as Blob)
        this.is_loading = false
      },
      (error: any) => {
        this.error_message = error
      }
    );
  }

  img_up_scaled: any;

  ngOnInit(): void {
  }

}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  baseApiUrl = "http://api.imagine.wiratama.tech/"

  constructor(private http: HttpClient) {
  }

  upload(file: any, model: string, noise_reduction: string): Observable<any> {
    const formData = new FormData();
    formData.append("image", file, file.name);
    formData.append("model", model);
    if (noise_reduction == 'True') {
      formData.append("noise_reduction", 'True');
    }
    return this.http.post(this.baseApiUrl, formData, {responseType: 'blob'})
  }
}
