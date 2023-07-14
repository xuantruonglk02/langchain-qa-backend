import { Injectable, PipeTransform } from '@nestjs/common';
import _ from 'lodash';

@Injectable()
export class RemoveEmptyQueryPipe implements PipeTransform {
    constructor() {
        //
    }

    removeEmptyValue(query: any) {
        const removeEmpty = (item: any) => {
            _.mapKeys(item, (value, key) => {
                // remove null, undefined, empty
                if (value !== 0 && !value) {
                    delete item[key];
                }
                // remove string contain only space characters
                else if (
                    typeof value === 'string' &&
                    !_.trim(value as string)
                ) {
                    delete item[key];
                }

                // iterate array
                else if (_.isArray(value)) {
                    value.forEach((property, index) => {
                        // remove null, undefined, empty
                        if (!property) {
                            value.splice(index, 1);
                        }

                        // remove string contain only space characters
                        else if (
                            typeof property === 'string' &&
                            !_.trim(property as string)
                        ) {
                            value.splice(index, 1);
                        }
                    });
                }
            });
        };

        removeEmpty(query);
    }

    transform(query: any) {
        this.removeEmptyValue(query);
        return query;
    }
}
