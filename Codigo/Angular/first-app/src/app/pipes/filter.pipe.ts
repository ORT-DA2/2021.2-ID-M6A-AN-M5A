import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: string[], filterValue: string): string[] {
    return list.filter((x) =>
      x.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
    );
  }
}
