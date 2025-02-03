import React, { useState } from 'react';
import styles from './styles.module.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface PluginCapability {
  id: string;
  name: string;
  description: string;
  code: string;
}

const capabilities: PluginCapability[] = [
  {
    id: 'processEvent',
    name: '事件处理',
    description: '处理和转换事件数据',
    code: `
export async function processEvent(event) {
    // 在此处理事件
    return event
}`
  },
  {
    id: 'onEvent',
    name: '事件响应',
    description: '响应事件并执行操作',
    code: `
export async function onEvent(event) {
    // 在此响应事件
}`
  },
  {
    id: 'scheduledTask',
    name: '定时任务',
    description: '执行定期任务',
    code: `
export const jobs = {
    runDaily: {
        name: 'daily-task',
        type: 'schedule',
        exec: async () => {
            // 在此执行定时任务
        }
    }
}`
  },
  {
    id: 'webhook',
    name: 'Webhook处理',
    description: '处理和发送Webhook',
    code: `
export function composeWebhook(event) {
    return {
        url: 'https://your-webhook-url',
        headers: {},
        payload: event
    }
}`
  },
  {
    id: 'frontend',
    name: '前端组件',
    description: '添加自定义UI组件',
    code: `
export function setupPlugin({ config }) {
    // 前端初始化代码
}

export function teardownPlugin() {
    // 清理代码
}`
  }
];

export function PluginGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
    url: '',
    version: '0.1.0',
    selectedCapabilities: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCapabilityToggle = (capabilityId: string) => {
    setFormData(prev => {
      const selected = prev.selectedCapabilities.includes(capabilityId)
        ? prev.selectedCapabilities.filter(id => id !== capabilityId)
        : [...prev.selectedCapabilities, capabilityId];
      return {
        ...prev,
        selectedCapabilities: selected
      };
    });
  };

  const generatePluginPackage = async () => {
    const zip = new JSZip();

    // 生成 plugin.json
    const pluginJson = {
      name: formData.name,
      description: formData.description,
      url: formData.url,
      version: formData.version,
      main: 'dist/index.js',
      config: {
        // 基础配置
        frontend: formData.selectedCapabilities.includes('frontend'),
        backend: true,
        // 配置项示例
        example_string: {
          name: '示例文本',
          type: 'string',
          default: '',
          required: false,
          description: '这是一个示例配置项'
        },
        example_number: {
          name: '示例数字',
          type: 'number',
          default: 0,
          required: false,
          description: '这是一个数字类型的配置项'
        },
        example_boolean: {
          name: '示例开关',
          type: 'boolean',
          default: false,
          required: false,
          description: '这是一个布尔类型的配置项'
        }
      },
      // 插件能力声明
      capabilities: {
        methods: formData.selectedCapabilities,
        jobs: formData.selectedCapabilities.includes('scheduledTask') ? ['runDaily'] : [],
        scheduled_tasks: formData.selectedCapabilities.includes('scheduledTask') ? ['runDaily'] : []
      }
    };
    zip.file('plugin.json', JSON.stringify(pluginJson, null, 2));

    // 生成 README.md
    const readme = `# ${formData.name}

${formData.description}

## 功能特性

${capabilities
  .filter(cap => formData.selectedCapabilities.includes(cap.id))
  .map(cap => `- ${cap.name}: ${cap.description}`)
  .join('\n')}

## 项目结构

\`\`\`
${formData.name.toLowerCase().replace(/\s+/g, '-')}/
├── src/                    # 源代码目录
│   ├── index.ts           # 插件主入口文件
│   └── __tests__/         # 测试文件目录
│       └── index.test.ts  # 单元测试文件
├── dist/                  # 编译输出目录
├── plugin.json           # 插件配置文件
├── package.json         # 项目依赖配置
├── tsconfig.json       # TypeScript 配置
└── README.md          # 项目说明文档
\`\`\`

## 文件说明

### plugin.json
插件的核心配置文件，定义了插件的基本信息、配置项和能力。包含：
- 插件名称、描述、版本等基本信息
- 配置项定义（支持string、number、boolean等类型）
- 插件能力声明（methods、jobs、scheduled_tasks等）

### src/index.ts
插件的主要实现文件，包含：
${formData.selectedCapabilities.map(capId => {
  const cap = capabilities.find(c => c.id === capId);
  return `- ${cap.name}的实现代码`;
}).join('\n')}

### __tests__/index.test.ts
单元测试文件，用于测试插件功能的正确性。建议为每个主要功能编写测试用例。

### package.json
项目依赖配置文件，包含：
- 项目元信息
- 依赖包列表
- 构建和测试脚本

### tsconfig.json
TypeScript 配置文件，定义了编译选项和项目结构。

## 开发指南

### 环境准备
1. 确保已安装 Node.js (>= 14.x)
2. 克隆此仓库
3. 安装依赖：
   \`\`\`bash
   npm install
   \`\`\`

### 开发流程
1. 修改 src/index.ts 实现插件功能
2. 编写测试用例
3. 运行测试：
   \`\`\`bash
   npm test
   \`\`\`
4. 构建插件：
   \`\`\`bash
   npm run build
   \`\`\`

### 配置说明
在 plugin.json 中可以定义插件的配置项：
\`\`\`json
{
  "name": "配置项名称",
  "type": "配置项类型",
  "default": "默认值",
  "required": false,
  "description": "配置项说明"
}
\`\`\`

### 调试技巧
1. 使用 console.log 输出调试信息
2. 查看 PostHog 后台的插件日志
3. 使用 Jest 的调试功能进行断点调试

## 部署

1. 构建插件：
   \`\`\`bash
   npm run build
   \`\`\`
2. 将插件上传到 PostHog 后台
3. 配置插件参数
4. 启用插件

## 作者

${formData.author}

## 许可证

MIT
`;
    zip.file('README.md', readme);

    // 生成 package.json
    const packageJson = {
      name: formData.name.toLowerCase().replace(/\s+/g, '-'),
      version: formData.version,
      description: formData.description,
      author: formData.author,
      license: 'MIT',
      scripts: {
        build: 'tsc',
        test: 'jest',
        'build:watch': 'tsc --watch',
        'test:watch': 'jest --watch'
      },
      dependencies: {
        '@posthog/plugin-scaffold': '^1.0.0',
        '@posthog/plugin-contrib': '^1.0.0'
      },
      devDependencies: {
        typescript: '^4.5.0',
        '@types/node': '^16.0.0',
        jest: '^27.0.0',
        '@types/jest': '^27.0.0',
        'ts-jest': '^27.0.0',
        '@typescript-eslint/parser': '^5.0.0',
        '@typescript-eslint/eslint-plugin': '^5.0.0',
        eslint: '^8.0.0',
        'eslint-config-prettier': '^8.0.0',
        prettier: '^2.0.0'
      }
    };
    zip.file('package.json', JSON.stringify(packageJson, null, 2));

    // 生成 tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es2019',
        module: 'commonjs',
        lib: ['es2019'],
        declaration: true,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: 'dist',
        rootDir: 'src'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', '**/*.test.ts']
    };
    zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));

    // 生成主代码文件
    let mainCode = `import { Plugin, PluginEvent, PluginMeta } from '@posthog/plugin-scaffold'

`;

    // 添加选中的功能代码
    capabilities
      .filter(cap => formData.selectedCapabilities.includes(cap.id))
      .forEach(cap => {
        mainCode += cap.code + '\n\n';
      });

    zip.file('src/index.ts', mainCode);

    // 生成测试文件
    const testCode = `import { Plugin, PluginEvent, PluginMeta } from '@posthog/plugin-scaffold'

describe('${formData.name}', () => {
    let plugin: Plugin
    let event: PluginEvent

    beforeEach(() => {
        plugin = new Plugin()
        event = {
            event: 'test_event',
            properties: {},
            timestamp: new Date().toISOString(),
            team_id: 1,
            distinct_id: 'test_user',
            uuid: 'test_uuid'
        }
    })

    ${formData.selectedCapabilities.includes('processEvent') ? `
    test('processEvent modifies event correctly', async () => {
        const processedEvent = await plugin.processEvent(event)
        expect(processedEvent).toBeDefined()
    })` : ''}

    ${formData.selectedCapabilities.includes('onEvent') ? `
    test('onEvent handles event correctly', async () => {
        await plugin.onEvent(event)
        // Add your assertions here
    })` : ''}

    ${formData.selectedCapabilities.includes('scheduledTask') ? `
    test('scheduled task executes correctly', async () => {
        const task = plugin.jobs.runDaily
        expect(task).toBeDefined()
        await task.exec()
        // Add your assertions here
    })` : ''}
})
`;
    zip.file('src/__tests__/index.test.ts', testCode);

    // 生成 .gitignore
    const gitignore = `# Dependencies
node_modules/

# Build
dist/

# Tests
coverage/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local
`;
    zip.file('.gitignore', gitignore);

    // 生成 .prettierrc
    const prettierrc = {
      semi: false,
      singleQuote: true,
      tabWidth: 4,
      trailingComma: 'es5',
      printWidth: 100
    };
    zip.file('.prettierrc', JSON.stringify(prettierrc, null, 2));

    // 生成 .eslintrc.js
    const eslintrc = `module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        // 自定义规则
    }
}`;
    zip.file('.eslintrc.js', eslintrc);

    // 生成 jest.config.js
    const jestConfig = `module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}`;
    zip.file('jest.config.js', jestConfig);

    // 下载 zip 文件
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${formData.name.toLowerCase().replace(/\s+/g, '-')}-plugin.zip`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>PostHog 插件开发包生成器</h1>
      
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>插件名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="例如: My Awesome Plugin"
          />
        </div>

        <div className={styles.formGroup}>
          <label>描述</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="描述你的插件功能..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>作者</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="你的名字"
          />
        </div>

        <div className={styles.formGroup}>
          <label>项目URL</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://github.com/your-username/your-plugin"
          />
        </div>

        <div className={styles.formGroup}>
          <label>版本</label>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            placeholder="0.1.0"
          />
        </div>

        <div className={styles.capabilities}>
          <h3>选择插件能力</h3>
          <div className={styles.capabilityGrid}>
            {capabilities.map(capability => (
              <div
                key={capability.id}
                className={`${styles.capabilityCard} ${
                  formData.selectedCapabilities.includes(capability.id) ? styles.selected : ''
                }`}
                onClick={() => handleCapabilityToggle(capability.id)}
              >
                <h4>{capability.name}</h4>
                <p>{capability.description}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.generateButton}
          onClick={generatePluginPackage}
          disabled={!formData.name || formData.selectedCapabilities.length === 0}
        >
          生成插件开发包
        </button>
      </div>
    </div>
  );
} 