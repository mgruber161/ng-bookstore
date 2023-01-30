import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { BooksApiService } from './books-api.service';
import { IBook, IBooksGetDto, IPostDto } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  bookDtos?: IBooksGetDto
  books: IBook[] = []
  newBook: IBook = this.getEmptyNewBook()
  isbnErrorText = ''

  displayedColumns: string[] = ['id', 'title', 'isbn', 'author', 'preview', 'delete']

  @ViewChild(MatTable) table: MatTable<IBook> | undefined

  constructor(private booksApiService: BooksApiService) {
  }

  ngOnInit(): void {
    this.booksApiService.getAllBooks()
      .subscribe(data => {
        console.log(data)
        this.bookDtos = data
        console.log('Data loaded!')
        //  this.books.splice(0, this.books.length)
        this.bookDtos.records.forEach(book => {
          let newBook: IBook = {
            id: book.id,
            title: book.fields.title,
            isbn: book.fields.isbn,
            author: book.fields.author,
            preview: book.fields.preview
          }
          this.books.push(newBook)
        })
        console.log(`books.length: ${this.books.length}`)
        this.table?.renderRows()
      })
  }

  // 3760778739

  isInvalid() {
    return this.isbnErrorText.length > 0 || this.newBook.title.length == 0 || this.newBook.isbn.length == 0
  }

  isbnChanged() {
    const isbn10 = this.newBook.isbn.replaceAll('-', '')

    console.log('Isbn, genormt: ' + isbn10 + ', length: ' + isbn10.length)
    if (isbn10.length != 10) {
      this.isbnErrorText = 'ISBN muss genau 10 Zeichen lang sein'
      return
    }
    const result = this.getIsbnValidationError(isbn10)
    console.log('Isbn, Fehlermeldung: ' + result)
    if(result.length > 0){
      this.isbnErrorText = result
      return
    }
    this.isbnErrorText = ''
  }

  /// Eine gültige ISBN-Nummer besteht aus den Ziffern 0, ... , 9,
  /// 'x' oder 'X' (nur an der letzten Stelle)
  /// Die Gesamtlänge der ISBN beträgt 10 Zeichen.
  /// Für die Ermittlung der Prüfsumme werden die Ziffern
  /// von rechts nach links mit 1 - 10 multipliziert und die
  /// Produkte aufsummiert. Ist das rechte Zeichen ein x oder X
  /// wird als Zahlenwert 10 verwendet.
  /// Die Prüfsumme muss modulo 11 0 ergeben.
  /// <returns>Fehlermeldung oder Leerstring</returns>
  getIsbnValidationError(isbn: string): string {
    let weight = 10  // Startgewicht
    let sum = 0
    for (let index = 0; index < 10; index++) {
      let ch = isbn[index]
      let number = 0
      if (ch >= '0' || ch <= '9') {
        number = Number(ch)
      }
      else  // keine Ziffer  => x oder X an letzter Stelle
      {
        if (index != 9) {
          return 'Nur Ziffern und x an letzter Stelle erlaubt'
        }
        if (ch == 'x' || ch == 'X') {
          number = 10
        }
        else {
          return 'Nur x an letzter Stelle erlaubt'
        }
      }
      // zahl enthält gültigen Wert
      sum += number * weight
      weight--
    }
    if (sum % 11 != 0) {
      return `isbn checksum is ${sum % 11} (should be 0!")`
    }
    return ''
  }

  getEmptyNewBook(): IBook {
    this.isbnErrorText = ''
    return {
      id: '',
      title: '',
      isbn: '',
      author: '',
      preview: ''
    }
  }

  submit(f : NgForm) {
    console.log(f);
    // let postDto: IPostDto = {
    //   "fields": {
    //     title: this.newBook.title,
    //     author: this.newBook.author,
    //     isbn: this.newBook.isbn,
    //     preview: this.newBook.preview,
    //   }
    // }
    // this.booksApiService.addBook(postDto)
    //   .subscribe(response => {
    //     console.log(response)
    //     if (response.id != undefined) {
    //       this.newBook.id = response.id
    //       this.books.push(this.newBook)
    //       this.newBook = this.getEmptyNewBook()
    //       this.table?.renderRows()
    //     }
    //   })
  }

  delete(item: IBook) {
    this.booksApiService.deleteBook(item.id)
      .subscribe(response => {
        console.log(response)
        if (response.id != undefined) {
          const index = this.books.indexOf(item)
          if (index >= 0) {
            this.books.splice(index, 1)
            this.table?.renderRows()
          }
        }
      })
  }

}
