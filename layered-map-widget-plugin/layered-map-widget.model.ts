import { IAlarm, IEvent, IManagedObject, IOperation } from '@c8y/client';
import { FeatureGroup, LatLng, Marker } from 'leaflet';
import { has } from 'lodash';

export type BasicLayerConfig = {
  name: string;
  icon: string;
  color: string;
  pollingInterval: number;
  enablePolling: 'true' | 'false';
  popoverConfig?: PopoverConfig;
};

export type PopoverConfig = {
  showAlarms: boolean;
  showDate: boolean;
  actions: PopoverAction[];
};

export type OperationAction = { type: 'operation'; label: string; body: Partial<IOperation> };
export type AlarmAction = { type: 'alarm'; label: string; body: Partial<IAlarm> };
export type EventAction = { type: 'event'; label: string; body: Partial<IEvent> };
export type PopoverAction = OperationAction | AlarmAction | EventAction;

export const DEFAULT_CONFIG: PopoverConfig = {
  showAlarms: true,
  showDate: true,
  actions: [],
};

export type DeviceFragmentLayerConfig = BasicLayerConfig & {
  fragment: string;
  value: string;
  device: { id: string; name: string };
};

export function isDeviceFragmentLayerConfig(config: unknown): config is DeviceFragmentLayerConfig {
  return has(config, 'fragment') && has(config, 'value');
}

export type QueryLayerConfig = BasicLayerConfig & {
  filter: object;
  type: 'Inventory' | 'Alarm' | 'Event';
};

export function isQueryLayerConfig(config: BasicLayerConfig): config is QueryLayerConfig {
  return has(config, 'filter');
}

export type WebMapServiceLayerConfig = BasicLayerConfig & {
  url: string;
  wmsLayers: { name: string }[];
  token?: string;
};

export function isWebMapServiceLayerConfig(
  config: BasicLayerConfig
): config is WebMapServiceLayerConfig {
  return has(config, 'url') && has(config, 'wmsLayers');
}

export type LayerType = DeviceFragmentLayerConfig | QueryLayerConfig | WebMapServiceLayerConfig;

export type LayerConfig<LayerType> = {
  config: LayerType;
  active: boolean;
};

export type LayerAttributes = {
  active: boolean;
  devices: string[];
  coordinates: Map<string, LatLng>;
  markerCache: Map<string, Marker<any>>;
  group: FeatureGroup;
};

export class MyLayer implements LayerAttributes {
  config: DeviceFragmentLayerConfig | QueryLayerConfig;
  devices: string[] = [];
  coordinates = new Map<string, LatLng>();
  markerCache = new Map<string, Marker<any>>();
  group = new FeatureGroup();
  initialLoad: Promise<void>;
  active = true;
}

export type PollingDelta = {
  add: IManagedObject[];
  remove: string[];
};

export interface ILayeredMapWidgetConfig {
  devices?: { name: string; id: string }[];
  selectedTrack?: string;
  tracks?: ITrack[];
  saved?: boolean;
  layers: LayerConfig<BasicLayerConfig>[];
  positionPolling?: {
    enabled: 'true' | 'false';
    interval: number;
  };
  autoCenter?: 'true' | 'false';
  manualCenter?: {
    lat: number;
    long: number;
    zoomLevel: number;
  };
}

export interface ITrack {
  name: string;
  coords: LatLng[];
  createDate: Date;
}
