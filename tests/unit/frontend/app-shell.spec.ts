import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { App } from "../../../src/frontend/src/app/app";

describe("application shell", () => {
  it("renders its heading in the main landmark", async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector("main");
    expect(main).not.toBeNull();
    expect(main.querySelector("h1")?.textContent?.trim()).toBe(
      "Member Services Foundation",
    );
  });
});
