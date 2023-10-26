import type { Schema, Attribute } from '@strapi/strapi';

export interface EinstellungenFeriensprechstunde extends Schema.Component {
  collectionName: 'components_einstellungen_feriensprechstundes';
  info: {
    displayName: 'Feriensprechstunde';
    icon: 'border-all';
    description: '';
  };
  attributes: {
    tag: Attribute.Date &
      Attribute.Required &
      Attribute.DefaultTo<'2022-04-23'>;
    Personen: Attribute.Component<'einstellungen.personen', true> &
      Attribute.Required;
  };
}

export interface EinstellungenFeriensprechstundendauer
  extends Schema.Component {
  collectionName: 'components_einstellungen_feriensprechstundendauers';
  info: {
    displayName: 'Feriensprechstundendauer';
    icon: 'cog';
  };
  attributes: {
    Von: Attribute.Time & Attribute.Required & Attribute.DefaultTo<'14:00'>;
    Bis: Attribute.Time & Attribute.Required & Attribute.DefaultTo<'16:00'>;
  };
}

export interface EinstellungenPersonen extends Schema.Component {
  collectionName: 'components_einstellungen_personens';
  info: {
    displayName: 'Personen';
    icon: 'angry';
  };
  attributes: {
    Name: Attribute.String & Attribute.Required;
  };
}

export interface FachkombinationFach extends Schema.Component {
  collectionName: 'components_fachkombination_faches';
  info: {
    displayName: 'Fach';
    icon: 'archive';
    description: '';
  };
  attributes: {
    fach: Attribute.Enumeration<
      ['Informatik', 'Physik', 'Angewandte Informatik', 'Mathe']
    > &
      Attribute.Required;
  };
}

export interface FachkombinationLehramt extends Schema.Component {
  collectionName: 'components_fachkombination_lehramts';
  info: {
    displayName: 'Lehramt';
    icon: 'bullseye';
    description: '';
  };
  attributes: {
    schultyp: Attribute.Enumeration<['Gymnasium']> &
      Attribute.Required &
      Attribute.DefaultTo<'Gymnasium'>;
    zweitfach_DE: Attribute.String;
    zweitfach_EN: Attribute.String;
    drittfach_DE: Attribute.String;
    drittfach_EN: Attribute.String;
  };
}

export interface SprechstundenSprechstundentag extends Schema.Component {
  collectionName: 'components_sprechstunden_sprechstundentags';
  info: {
    displayName: 'Sprechstundentag';
    icon: 'audio-description';
  };
  attributes: {
    slot0: Attribute.Component<'sprechstunden.stunde', true>;
    slot1: Attribute.Component<'sprechstunden.stunde', true>;
    slot2: Attribute.Component<'sprechstunden.stunde', true>;
  };
}

export interface SprechstundenStunde extends Schema.Component {
  collectionName: 'components_sprechstunden_stundes';
  info: {
    displayName: 'Stunde';
    icon: 'clock';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
  };
}

export interface UniKinoGenre extends Schema.Component {
  collectionName: 'components_uni_kino_genres';
  info: {
    displayName: 'genre';
    icon: 'bezier-curve';
    description: '';
  };
  attributes: {
    genre: Attribute.Enumeration<
      [
        'Action',
        'Actionkom\u00F6die',
        'Actiondrama',
        'Abenteuer',
        'Animationsfilm',
        'Bibliographie',
        'Comicverfilmung',
        'Drama',
        'Gesellschaftssatire',
        'Krimi',
        'Kriegssatire',
        'Kriegsfilm',
        'Kom\u00F6die',
        'Musikfilm',
        'Thriller',
        'Tragikom\u00F6die',
        'Mystery',
        'Abenteuer',
        'Historiendrama',
        'ScienceFiction'
      ]
    > &
      Attribute.Required;
  };
}

export interface UniKinoOrte extends Schema.Component {
  collectionName: 'components_uni_kino_ortes';
  info: {
    displayName: 'orte';
    icon: 'globe-africa';
  };
  attributes: {
    laender: Attribute.Enumeration<['USA', 'UK', 'SWE', 'DNK']> &
      Attribute.Required;
  };
}

export interface UniSemester extends Schema.Component {
  collectionName: 'components_uni_semesters';
  info: {
    displayName: 'Semester';
    icon: 'address-card';
  };
  attributes: {
    Semester: Attribute.Enumeration<['WiSe', 'SoSe']> &
      Attribute.Required &
      Attribute.DefaultTo<'WiSe'>;
    Jahr: Attribute.Integer & Attribute.Required & Attribute.DefaultTo<2000>;
  };
}

export interface VertreterComponentsPositionEnum extends Schema.Component {
  collectionName: 'components_vertreter_components_position_enums';
  info: {
    displayName: 'positionEnum';
    icon: 'battery-full';
  };
  attributes: {
    enum: Attribute.Enumeration<
      [
        'Chef',
        'Vize',
        'Finanzen',
        'Vernetzung',
        'Uni-Kino',
        '\u00D6ffentlichkeitsarbeit',
        'Bierkoordination',
        'Physikerbar',
        'Grafiken',
        'Skripten'
      ]
    > &
      Attribute.Required;
    text: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'einstellungen.feriensprechstunde': EinstellungenFeriensprechstunde;
      'einstellungen.feriensprechstundendauer': EinstellungenFeriensprechstundendauer;
      'einstellungen.personen': EinstellungenPersonen;
      'fachkombination.fach': FachkombinationFach;
      'fachkombination.lehramt': FachkombinationLehramt;
      'sprechstunden.sprechstundentag': SprechstundenSprechstundentag;
      'sprechstunden.stunde': SprechstundenStunde;
      'uni-kino.genre': UniKinoGenre;
      'uni-kino.orte': UniKinoOrte;
      'uni.semester': UniSemester;
      'vertreter-components.position-enum': VertreterComponentsPositionEnum;
    }
  }
}
