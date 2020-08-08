/*
 * @lc app=leetcode id=10 lang=typescript
 *
 * [10] Regular Expression Matching
 */

// @lc code=start
function isMatch(input: string, pattern: string): boolean {
  const tokens = parse(pattern)
  return isMatchTokens(input, tokens);
};

function isMatchTokens(input: string, tokens: Token[]): boolean {
  let inputIndex = 0;

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex];
    switch (token.type) {
      case 'char':
      case 'any':
        if (input[inputIndex] === undefined) {
          return false;
        }
        if (!isMatchChar(input[inputIndex], token)) {
          return false;
        }
        inputIndex += 1;
        break;
      case 'multi':
        let restString = input.substr(inputIndex);
        let matchStringList: string[] = []
        for (let i = 0; i < restString.length; i++) {
          const char = restString[i];
          if (isMatchChar(char, token.token)) {
            matchStringList.push(char);
          } else {
            break;
          }
        }
        while (matchStringList.length) {
          // console.log('match string with: ', matchStringList.join(""));
          // console.log('try match sub: ', input.substr(matchStringList.length + inputIndex));
          if (isMatchTokens(input.substr(matchStringList.length + inputIndex), tokens.slice(tokenIndex + 1))) {
            return true;
          }
          matchStringList.pop();
        }
        return isMatchTokens(input.substr(inputIndex), tokens.slice(tokenIndex + 1));
    }
  }

  return inputIndex === input.length;
}

function isMatchChar(char: string, token: Token): boolean {
  switch (token.type) {
    case 'char':
      return token.char === char;
    case 'any':
      return true;
  }
  return true;
}

type Token =
  | {
    type: 'char';
    char: string;
  }
  | {
    type: 'any';
  }
  | {
    type: 'multi';
    token: Token;
  }

function parse(pattern: string): Token[] {
  const rules: Token[] = [];
  for (const char of pattern) {
    switch (char) {
      case '.':
        rules.push({ type: 'any' });
        break;
      case '*':
        rules.push({ type: 'multi', token: rules.pop() as Token });
        break;
      default:
        rules.push({ type: 'char', char });
    }
  }
  return rules;
}
// @lc code=end

describe('10.regular-expression-match', () => {
  it('match by char', () => {
    expect(isMatch('aa', 'a')).toBeFalsy();
  });

  it('"*" match zero or more preceding element', () => {
    expect(isMatch('', 'a*')).toBeTruthy();
    expect(isMatch('aaaab', 'a*b')).toBeTruthy();
    expect(isMatch('aaaab', 'a*c')).toBeFalsy();
    expect(isMatch('b', 'a*b')).toBeTruthy();
  });

  it('"." match any element', () => {
    expect(isMatch('abc', 'a.c')).toBeTruthy();
    expect(isMatch('bc', '..')).toBeTruthy();
    expect(isMatch('bc', '.')).toBeFalsy();
  });

  it('use both "." & "*"', () => {
    expect(isMatch('aaaaaaaaaaaaab', 'a*a*a*a*a*a*a*a*a*a*c')).toBeTruthy();
    expect(isMatch('ab', '.*..c*')).toBeTruthy();
    expect(isMatch('a', '.*..a*')).toBeFalsy();
    expect(isMatch('aaa', 'ab*ac*a')).toBeTruthy();
    expect(isMatch('acdaacd', 'a.*cd*.')).toBeTruthy();
    expect(isMatch('aab', 'c*a*b')).toBeTruthy();
    expect(isMatch('mississippi', 'mis*is*p*.')).toBeFalsy();
  })
});
