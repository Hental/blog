# storybook 入门

## storybook 是什么

storybook 是一套面向 UI 组件的开发环境，它基于组件维度，可以很方便的查看，浏览组件，像一个组件的可视化的测试用例。

### 概念

- story：组件在某个特定状态下的 UI 渲染展示，比如一个 Switch 组件的开启状态下的 UI。
- stories 文件：stroy 的集合，通常包含单个组件不同状态下的渲染展示，以 .stories.js 或者 .stories.ts 结尾，比如一个 Switch 组件有的 stories 文件，包含开启状态下和关闭状态下的 2 个 story。

## 初始化

在项目根目录下执行

```text
// 1. 安装依赖 @storybook/vue（核心包），@storybook/addon-essentials（插件包）
// 2. 自动生成配置文件 storybook/*
// 3. package.json 增加 2 个命令 storybook (本地开发) build-storybook（构建静态资源）
// 4. 拷贝 demo
npx sb init
```

如果是基于 `vue-cli` 的项目，推荐使用 [vue-cli-plugin-storybook](https://www.npmjs.com/package/vue-cli-plugin-storybook 插件，能复用 vue.config.js 的配置。（下面的教程主要是基于该插件）

```text
// 1. 安装依赖 @storybook/vue（核心包），@storybook/addon-essentials（插件包）
// 2. 自动生成配置文件 config/storybook/*
// 3. package.json 增加 2 个命令 storybook:serve (本地开发) storybook:build（构建静态资源）
// 4. 拷贝 demo
vue add storybook
```

## 配置

storybook 初始化后会生成 config/storybook 文件夹，storybook 相关的配置都放在这个文件夹下。

```
- config
  - storybook
    -- main.js      // storybook 配置文件
    -- preview.js   // 组件预览的入口文件
```

```js
// main.js

module.exports = {
  // stories 文件
  stories: [
    '../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  // storybook 扩展
  addons: [
    '@storybook/addon-essentials'
  ],

  // 自定义 webpack 配置
  // 入参 config 是 storybook 的 webpack 配置
  webpackFinal: async (config) => {
  }，

  // 自定义 babel 配置，默认会使用 .babelrc 或者 babel.config.js 的配置，大部分情景下不要单独配置
  babel: async (options) => ({
    ...options,
  }),
}
```

## 启动

执行 `storybook:serve` 命令启动 storybook 服务。

```sh
npm run storybook:serve

// 等同于
vue-cli-service storybook:serve -p 6006 -c config/storybook
//   -p [webpack devServer 的端口号]
//   -c [storybook 配置的文件夹路径]
```

- 参考：https://storybook.js.org/docs/vue/get-started/browse-stories
- SideBar:  story 的导航栏，展示你的所有 story，*.stories.js 文件定义的 story 都会在 sideBar 展示，点击 story 后，Canvas 会渲染展示对应的 story。
- Canvas: 渲染 story 的区域。
- Toolbar: 工具栏，一些用来修改 Canvas 的工具，以方便查看不同状态下组件的渲染。
- Addons: 插件栏，storybook 插件的渲染区域，用来输出插件的信息或者控制插件。

## 写 story

#### CSF（Component Story Format）

CSF 是推荐的 story 写法，基于 ES6 Module，一个 CSF  通常在一个 Module  里面，包含一个组件的多个 story，Module  里面的命名导出都对应一个 story，默认导出组件的 metadata 信息。

```ts
// Button.stories.tsx
import Button from './Button.vue';

// Default export stories 的 metadata  信息
export default {
  // 对应的组件，可选
  component: Button,
  // 左侧 sideBar 展示的名字，不支持中文，必选
  title: 'Components/Button',
};

// 所有的命名导出都是一个 story
// 每一个 story 都是一个函数，返回一个 Vue 组件
// 官方建议使用 Pascal 命名
export const WithTemplate = () => ({
  components: { Button },
  template: '<Button primary label="Button" />',
});

export const WithRender = () => ({
  components: { Button },
  render() {
    return <Button primary label="Button" />;
  },
});
```

### Args

Args 是 story 的配置对象，传递给 story，作为 story  函数的第一个入参。story 可以依据不同的 args 动态的改变组件的 props，slots。

```ts
import Button from './Button.vue';

export default {
  component: Button,
  title: 'Components/Button',
};

//👇 We create a “template” of how args map to rendering
const Template = (args, { argTypes }) => ({
  components: { Button },
  props: Object.keys(argTypes),
  // Storybook provides all the args in a $props variable.
  // Each arg is also available as their own name.
  template: '<Button v-bind="$props" v-on="$props" />',
});

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Primary',
};

const Secondary = Template.bind({});
Secondary.args = {
  ...Primary.args,
  primary: false,
}
```

### Decorators

和 JavaScript decorator 类似，storybook 的 decorator 用来包装 story，在 story 外层包装一个组件。decorator 是一个函数，入参是 story 和 context，返回一个 vue component option。

```ts
export default {
  component: Button,
  decorators: [
    () => ({
      template: '<div style="margin: 3em;"><story/></div>'
    })
  ],
};
```

### storiesOf api

`storiesOf` api 是一个老的 Api（未废弃，官方仍会维护），是通过 js 手动向 storybook 注册 story，相比较 CSF 方式更加繁琐些，但是 CSF 模式依赖 ESModule，ESModule 只支持静态导出，`storiesOf` 能更加灵活的增加 story，灵活性更高。

```ts
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';

// 调用 storiesOf 方法，传入 2 个参数
//   第一个参数是 Title，左侧 sideBar 展示的名字，不支持中文，必选
//   第二个参数传入当前的 webpack module，用来做 HMR
const stories = storiesOf('Components/Button', module)

// 每调用一次 add 方法，就会注册一个 story，传入 2 个参数
//   第一个参数是 name，左侧 sideBar 展示的名字
//   第二个参数是一个函数，返回一个 Vue 组件
stories
  .add('WithTemplate', () => ({
    components: { Button },
    template: '<Button primary label="Button" />',
  }))
  .add('WithRender', () => ({
    components: { Button },
    render() {
      return <Button primary label="Button" />;
    },
  }));
```

```tsx
import { storiesOf } from '@storybook/vue';
import Button from '../components/Button';
import { EnumButtonType } from '../enum';

const stories = storiesOf('Components/Button', module);

const typeList = Object.values(EnumButtonType);

typeList.forEach((type) => {
  stories.add(type, () => ({
    components: {
      Button,
    },

    data() {
      return {
        type,
      };
    },

    template: '<Button :type="type" />',
  }));
});
```

### preview.ts

preview.ts 是 canvas 的入口文件，会在每个 story 渲染的时候都会被加载，可以用来进行全局设置，比如设置 store，引入全局样式。

```ts
// 引入全局样式
import '../src/styles/app.scss';
import './global.scss';
// 引入应用的 entry，加载 Vue plugins
import '../src/main.ts';
import { Store } from 'vuex';
import Router from 'vue-router';

// 全局的 parameters
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

// 全局的 decorators
export const decorators = [
  (story, context) => ({
    store: new Store({}),
    router: new Router({}),
    template: '<div style="margin: 3em;"><story/></div>'
  }),
];
```

## 插件

storybook 有着丰富的插件生态，下面主要介绍下主要使用的插件。

- [@storybook/addon-essentials](https://github.com/storybookjs/storybook/tree/next/addons/essentials): 官方插件合集。
  - [@storybook/addon-actions](https://github.com/storybookjs/storybook/tree/next/addons/actions): 记录组件的事件。
  - [@storybook/addon-backgrounds](https://github.com/storybookjs/storybook/tree/next/addons/backgrounds): 修改预览区域的背景色
  - [@storybook/addon-controls](https://github.com/storybookjs/storybook/tree/next/addons/controls): 实时，动态的修改 story 的 Args
  - [@storybook/addon-docs](https://github.com/storybookjs/storybook/tree/next/addons/docs):
  - [@storybook/addon-viewport](https://github.com/storybookjs/storybook/tree/next/addons/viewport): 修改预览区域的大小，方便查看移动端组件的渲染展示。
  - [@storybook/addon-toolbars](https://github.com/storybookjs/storybook/tree/next/addons/toolbars): 在 toolbar 增加自定义的 tool，用来配置全局变量。

### Parameters

parameters 是给插件的选项。控制插件的行为。

```ts
export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
Primary.parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ],
  },
};
```

## 引用

1. https://storybook.js.org/docs/vue/get-started/introduction
2. https://storybook.js.org/docs/vue/addons/introduction
3. https://github.com/storybookjs/storybook/blob/master/lib/core/docs/storiesOf.md
4. https://zhuanlan.zhihu.com/p/358354774
