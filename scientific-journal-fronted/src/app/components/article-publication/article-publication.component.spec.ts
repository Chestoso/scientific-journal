import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePublicationComponent } from './article-publication.component';

describe('ArticlePublicationComponent', () => {
  let component: ArticlePublicationComponent;
  let fixture: ComponentFixture<ArticlePublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlePublicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlePublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
