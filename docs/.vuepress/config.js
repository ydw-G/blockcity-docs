module.exports = {
    dest: './dist',    // 设置输出目录
    base: '/blockcity/', // 设置站点根路径
    locales: {
        '/': {
            lang: 'zh-CN',
            title: '小应用',
            description: '小应用是布洛克城为开发者提供的开放能力，帮助开发者可以快速开发并上线属于自己的应用，为布洛克城的海量区块链用户提供服务。'
        },
        '/en/': {
            lang: 'en-US',
            title: 'The Small Application',
            description: 'The Small Application is based on the BlockCity DAPP, helping developers to quickly develop and launch their own applications, serving the massive blockchain users of BlockCity.'
        }
    },
    themeConfig: {
        repo: 'https://github.com/gxchain/blockcity-docs',
        docsDir: 'docs',
        editLinks: true,
        sidebarDepth: 3,
        theme: 'vue',
        algolia: {
            apiKey: '9c922922e09306b59a4aed7b9f5aaaf4',
            indexName: 'blockcity-docs'
        },
        locales: {
            '/': {
                label: '简体中文',
                selectText: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                nav: [
                    {
                        text: '介绍',
                        link: '/introduce/',
                    },
                    {
                        text: '开发',
                        link: '/developer/',
                    },
                    {
                        text: '设计',
                        link: '/design/',
                    },
                    {
                        text: '运营',
                        link: '/operation/',
                    },
                    {
                        text: 'FAQ',
                        link: '/faq/',
                    }
                ],
                sidebar: {
                    '/introduce/': genSidebarConfig('介绍', 'introduce'),
                    '/developer/': genSidebarConfig('开发', 'developer'),
                    '/design/': genSidebarConfig('设计', 'design'),
                    '/operation/': genSidebarConfig('运营', 'operation'),
                    '/faq/': genSidebarConfig('FAQ', 'faq')
                }
            },
            '/en/': {
                label: 'English',
                selectText: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                nav: [
                    {
                        text: 'Introduce',
                        link: '/en/introduce/',
                    },
                    {
                        text: 'Developer',
                        link: '/en/developer/',
                    },
                    {
                        text: 'Design',
                        link: '/en/design/',
                    },
                    {
                        text: 'Operation',
                        link: '/en/operation/',
                    },
                    {
                        text: 'FAQ',
                        link: '/en/faq/',
                    }
                ],
                sidebar: {
                    '/en/introduce/': genSidebarConfig('Introduce', 'introduce'),
                    '/en/developer/': genSidebarConfig('Developer', 'developer'),
                    '/en/design/': genSidebarConfig('Design', 'design'),
                    '/en/operation/': genSidebarConfig('Operation', 'operation'),
                    '/faq/': genSidebarConfig('FAQ', 'faq')
                }
            }
        }
    }
}

function genSidebarConfig(title, link) {
    switch (link) {
        case 'introduce':
            return [
                {
                    collapsable: false,
                    children: [
                        '',
                        'rights',
                        'steps'
                    ]
                }
            ]
        case 'developer':
            return [
                {
                    collapsable: false,
                    children: [
                        '',
                        'create',
                        'prepare',
                        'release',
                        'capacity',
                        'api'
                    ]
                }
            ]
        case 'design':
            return [
                {
                    collapsable: false,
                    children: [
                        ''
                    ]
                }
            ]
        case 'operation':
            return [
                {
                    collapsable: false,
                    children: [
                        '',
                        'rules',
                        'pay',
                        'charge'
                    ]
                }
            ]
        case 'faq':
            return [
                {
                    collapsable: false,
                    children: [
                        ''
                    ]
                }
            ]
    }
}
