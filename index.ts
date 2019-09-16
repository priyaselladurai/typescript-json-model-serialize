export class Base {

  public setValues(src) {

    const target = this;

    // tslint:disable-next-line: forin
    for (const propName in src) {

      const srcPropVal = src[propName];
      if (! srcPropVal) {
        target[propName] = undefined;
        continue;
      }

      if (typeof srcPropVal !== 'object') {
        // primitive type property
        target[propName] = srcPropVal;
        continue;
      }

      // object type property
      const objFactory = target['createInstance'];
      if (! objFactory) {
        // no object factory found - can't create correct instance
        continue;
      }

      const item = objFactory(propName);
      if (! item) {
        // object factory does not provide new instance for propName
        continue;
      }

      const isArray = Array.isArray(srcPropVal);
      if (! isArray) {
        target[propName] = this.createAndSet(objFactory, propName, srcPropVal);
        continue;
      }

      const items = [];
      for (const i in srcPropVal) {
        items.push(this.createAndSet(objFactory, propName, srcPropVal[i]));
      }
      target[propName] = items;
    }
  }
  createAndSet(objFactory, propName: string, srcPropVal) {
    const item = objFactory(propName);
    item.setValues(srcPropVal);
    return item;
  }
}

export class Company extends Base {
  name: string;
}

export class Employee extends Base {

  id: number;
  name: string;
  pastCompanies: Array<Company>;
  currCompany: Company;
  prevCompany: Company;

  createInstance(propName: string) {
    switch (propName) {
      case 'currCompany': // fall through
      case 'prevCompany': // fall through
      case 'pastCompanies': return new Company();
      default: console.log('createInstance doest not support:', propName);
    }
  }

  constructor(){ super();}
}

let e = new Employee();

e.setValues({ id: 1,
              name: "e1",
              currCompany: { name: 'ofs' },
              prevCompany: { name: 'none' },
              pastCompanies: [ { name: 'pc1'} ]
            }
);
console.log(e);

e = new Employee();
e.setValues({ id: 2,
              name: "priya",
              currCompany: { name: 'ofs1' },
              pastCompanies: [ { name: 'pc2'} ]
            }
);
console.log(e);

e = new Employee();
e.setValues({ id: 3,
              name: "priya",
              currCompany: { name: 'ofs1' },
              pastCompanies: []
            }
);
console.log(e);

e = new Employee();
e.setValues({ id: 4,
              name: "priya",
              currCompany: { name: 'ofs1' }
            }
);
console.log(e);
console.log(e.pastCompanies);

e = new Employee();
e.setValues({ id: 5,
              name: "priya",
              currCompany: { name: 'ofs1' },
              pastCompanies: [ { name: 'pc2'} ],
              someExtraProp: 'shouldNotBeThere'
            }
);
console.log(e);
