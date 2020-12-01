import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Graphql } from "../../models/ig_response";
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  link: string = null;
  code: string = null;
  data: Graphql;
  loading = false;
  error: string = '';
  constructor(private api: ApiService, private meta: Meta,
    private title: Title) { }

  ngOnInit(): void {
    this.addMetaTags();
  }

  onDownload() {
    this.error = '';
    if (this.link != null && this.link.length > 0 && !this.loading) {
      this.code = this.link.replace('https://www.instagram.com/p/', '')
      this.code = this.code.substring(0, this.code.indexOf('/'));
      this.loading = true;
      this.api.get(this.code).subscribe(data => {
        this.error = '';
        this.data = data['graphql'] as Graphql;
        this.loading = false;
      }, e => {
        this.data = null;
        this.loading = false;
        if (e.status == 404) {
          this.error = 'Paste a valid link';
        } else if (e.status == 0) {
          this.error = 'Network error';
        } else {
          this.error = e.status + ' Unknown error';
        }
      })
    } else {
      this.error = 'Paste a valid link';
    }
  }

  clear() {
    try {
      this.link.trim()
      this.link = this.link.substring(0, this.link.indexOf('?'));
    } catch (error) {

    }
  }

  getType() {
    return this.data.shortcode_media.is_video ? 'Video' : 'Image';
  }

  download(file) {
    this.api.downloadimage(file, 'IGDownload.me').subscribe(res => {
      var url = window.URL.createObjectURL(res.data);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none");
      a.href = url;
      a.download = "IGDownload";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }


  addMetaTags() {
    this.title.setTitle("Downloadr");
    this.meta.addTags([
      { name: "title", content: "Downloadr | Download videos and photos from Instagram and IGTV online" },
      { name: "description", content: "Downloadgram download videos and photos from Instagram and IGTV in just one click." },
      { name: "twitter: card", content: "Downloadr: Download videos and photos from Instagram and IGTV in just one click." },
      {
        name: "og: url", content: "/"
      },
      { name: "og: title", content: "Downloadr" },
      { name: "og: description", content: "Downloadgram download videos and photos from Instagram and IGTV in just one click." }
    ]);
  }


}
