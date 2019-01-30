const inherit = require('./inherit');

describe('prototype inherit', () => {
  let SuperClass;
  let SubClass;

  beforeEach(() => {
    SuperClass = function SuperClass(arg) {
      this.arg = arg;
      this.from = 'super';
    };

    SuperClass.prototype.log = function log() {
      return this.arg;
    };

    SubClass = function SubClass(arg) {
      this.arg = arg;
      this.from = 'sub';
    };

    SubClass.prototype.from = function from() {
      return this.from;
    };
  });

  it('', () => {

  });

});
