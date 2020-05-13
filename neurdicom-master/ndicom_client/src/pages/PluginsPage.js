import MenuContainer from "../components/common/MenuContainer";
import React, {Component} from "react";
import {Translate} from 'react-localize-redux';
import PluginsService from "../services/PluginsService";
import {Button, Divider, Dropdown, Form, Header, Message, Segment, Select} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import PluginItem from "../components/pluginsPage/PluginItem";
import * as axios from 'axios';

const PLUGINS_REPO_META_URL = "https://raw.githubusercontent.com/reactmed/neurdicom-plugins/master/REPO_META.json";

const patientMatcherOptions = [
    {key: 'EXACT', text: 'Exact equals', value: 'EXACT'},
    {key: 'STARTS_WITH', text: 'Starts with', value: 'STARTS_WITH'},
    {key: 'ENDS_WITH', text: 'Ends with', value: 'ENDS_WITH'},
    {key: 'FUZZY', text: 'Fuzzy matching', value: 'FUZZY'},
];
const options = [
    {key: 'DX', text: 'DX (Digital Radiography)', value: 'DX'},
    {key: 'MR', text: 'MR (Magnetic Resonance)', value: 'MR'},
    {key: 'CT', text: 'CT (Computer Tomography)', value: 'CT'},
    {key: 'US', text: 'US (Ultrasound)', value: 'US'},
    {key: 'ECG', text: 'ECG (Electrocardiography)', value: 'ECG'},
    {key: 'XA', text: 'XA (X-Ray)', value: 'XA'},
    {key: 'OT', text: 'OT (Other)', value: 'OT'},
];

class PluginsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plugins: []
        };
        this.setState = this.setState.bind(this);
    }

    componentWillMount = () => {
        PluginsService.findPlugins(installedPlugins => {
            installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                pluginsMap[plugin.name] = plugin;
                return pluginsMap;
            }, {});
            axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin.meta;
                    return pluginsMap;
                }, {});
                this.setState({plugins: {...allPlugins, ...installedPlugins}});
            });
        });
    };

    onDeletePlugin = (plugin) => {
        axios.delete(
            `/api/plugins/${plugin['id']}`
        ).then((response) => {
            PluginsService.findPlugins(installedPlugins => {
                installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin;
                    return pluginsMap;
                }, {});
                axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                    allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                        pluginsMap[plugin.name] = plugin.meta;
                        return pluginsMap;
                    }, {});
                    this.setState({plugins: {...allPlugins, ...installedPlugins}});
                });
            });
        }).catch((err) => {
            alert(err.response.data['message']);
            this.setState({});
        })
    };

    onInstallPlugin = (plugin) => {
        axios.post(
            `/api/plugins/${plugin['name']}/install`
        ).then((response) => {
            PluginsService.findPlugins(installedPlugins => {
                installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin;
                    return pluginsMap;
                }, {});
                axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                    allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                        pluginsMap[plugin.name] = plugin.meta;
                        return pluginsMap;
                    }, {});
                    this.setState({plugins: {...allPlugins, ...installedPlugins}});
                });
            });
        }).catch((err) => {
            alert(err.response.data['message']);
            this.setState({});
        })
    };

    render() {
        const plugins = this.state.plugins;
        if (plugins && Object.keys(plugins).length > 0) {
            return (
                <MenuContainer activeItem='plugins'>
                    <Translate>
                        {
                            (translate) => (
                                <div style={{margin: '30px'}}>
                                    <Form style={{marginBottom: '40px'}}>
                                        <Form.Group widths='equal'>
                                            <Form.Input
                                                label={translate('plugin.name')}
                                                icon='search'
                                                iconPosition='left'
                                                placeholder={translate('plugin.name')}
                                            />
                                            <Form.Input
                                                label={translate('plugin.author')}
                                                icon='search'
                                                iconPosition='left'
                                                placeholder={translate('plugin.author')}
                                            />
                                        </Form.Group>
                                    </Form>
                                    {
                                        Object.keys(plugins).map(pluginName => {
                                            const plugin = plugins[pluginName];
                                            plugin['name'] = pluginName;
                                            return (
                                                <PluginItem plugin={plugin} onDeletePlugin={this.onDeletePlugin}
                                                            onInstallPlugin={this.onInstallPlugin}/>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                    </Translate>
                </MenuContainer>
            )
        }
        else {
            return (
                <MenuContainer activeItem='plugins'>
                    <Message warning header='Нет доступных плагинов!'
                             content='Нет доступных плагинов, но вы может их установить.'/>
                </MenuContainer>
            )
        }
    }
}

export default PluginsPage;