import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  SingleTypeSchema,
  MediaAttribute,
  ComponentAttribute,
  TimeAttribute,
  SetPluginOptions,
  TextAttribute,
  ComponentSchema,
  DateAttribute,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access']> &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiEinstellungenEinstellungen extends SingleTypeSchema {
  info: {
    singularName: 'einstellungen';
    pluralName: 'einstellungens';
    displayName: 'Einstellungen';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    plakat: MediaAttribute & RequiredAttribute;
    jahr: IntegerAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMax<{
        min: 2000;
      }> &
      DefaultTo<2022>;
    keinePanik: MediaAttribute & RequiredAttribute;
    Ferien: BooleanAttribute & RequiredAttribute & DefaultTo<false>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::einstellungen.einstellungen',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::einstellungen.einstellungen',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiFeriensprechstundenFeriensprechstunden
  extends SingleTypeSchema {
  info: {
    singularName: 'feriensprechstunden';
    pluralName: 'feriensprechstundens';
    displayName: 'Feriensprechstunden';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Feriensprechstunde: ComponentAttribute<
      'einstellungen.feriensprechstunde',
      true
    > &
      RequiredAttribute;
    von: TimeAttribute & RequiredAttribute & DefaultTo<'14:00'>;
    bis: TimeAttribute & RequiredAttribute & DefaultTo<'16:00'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::feriensprechstunden.feriensprechstunden',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::feriensprechstunden.feriensprechstunden',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiSprechstundenSprechstunden extends SingleTypeSchema {
  info: {
    singularName: 'sprechstunden';
    pluralName: 'sprechstundens';
    displayName: 'Sprechstunden';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Montag: ComponentAttribute<'sprechstunden.sprechstundentag'>;
    Dienstag: ComponentAttribute<'sprechstunden.sprechstundentag'>;
    Mittwoch: ComponentAttribute<'sprechstunden.sprechstundentag'>;
    Donnerstag: ComponentAttribute<'sprechstunden.sprechstundentag'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::sprechstunden.sprechstunden',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::sprechstunden.sprechstunden',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiUniKinoFilmeUniKinoFilme extends CollectionTypeSchema {
  info: {
    singularName: 'uni-kino-filme';
    pluralName: 'uni-kino-filmes';
    displayName: 'Uni Kino Filme';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    titel: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    datum: DateTimeAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      DefaultTo<'2022-04-01T18:00:00.000Z'>;
    beschreibung: TextAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    filmort: ComponentAttribute<'uni-kino.orte', true> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    jahr: IntegerAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      SetMinMax<{
        min: 1900;
      }> &
      DefaultTo<2010>;
    dauer: IntegerAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      SetMinMax<{
        min: 1;
      }> &
      DefaultTo<1>;
    genre: ComponentAttribute<'uni-kino.genre', true> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    bild: MediaAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    trailerlink: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    archivSemester: ComponentAttribute<'uni.semester'> &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::uni-kino-filme.uni-kino-filme',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::uni-kino-filme.uni-kino-filme',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::uni-kino-filme.uni-kino-filme',
      'oneToMany',
      'api::uni-kino-filme.uni-kino-filme'
    >;
    locale: StringAttribute;
  };
}

export interface ApiVertreterVertreter extends CollectionTypeSchema {
  info: {
    singularName: 'vertreter';
    pluralName: 'vertreters';
    displayName: 'Vertreter';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    anzeigeName: StringAttribute & RequiredAttribute;
    grad: EnumerationAttribute<['Bachelor', 'Master']> &
      RequiredAttribute &
      DefaultTo<'Bachelor'>;
    feld: EnumerationAttribute<['Science']> &
      RequiredAttribute &
      DefaultTo<'Science'>;
    semester: IntegerAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }> &
      DefaultTo<1>;
    portrait: MediaAttribute & RequiredAttribute;
    hauptfach: ComponentAttribute<'fachkombination.fach'> & RequiredAttribute;
    lehramt: ComponentAttribute<'fachkombination.lehramt'>;
    position: EnumerationAttribute<
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
        'Root',
        'Skripten'
      ]
    > &
      RequiredAttribute;
    email: EmailAttribute & RequiredAttribute & UniqueAttribute;
    aktiv: BooleanAttribute & RequiredAttribute & DefaultTo<true>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::vertreter.vertreter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::vertreter.vertreter',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface EinstellungenFeriensprechstunde extends ComponentSchema {
  info: {
    displayName: 'Feriensprechstunde';
    icon: 'border-all';
    description: '';
  };
  attributes: {
    tag: DateAttribute & RequiredAttribute & DefaultTo<'2022-04-23'>;
    Personen: ComponentAttribute<'einstellungen.personen', true> &
      RequiredAttribute;
  };
}

export interface EinstellungenFeriensprechstundendauer extends ComponentSchema {
  info: {
    displayName: 'Feriensprechstundendauer';
    icon: 'cog';
  };
  attributes: {
    Von: TimeAttribute & RequiredAttribute & DefaultTo<'14:00'>;
    Bis: TimeAttribute & RequiredAttribute & DefaultTo<'16:00'>;
  };
}

export interface EinstellungenPersonen extends ComponentSchema {
  info: {
    displayName: 'Personen';
    icon: 'angry';
  };
  attributes: {
    Name: StringAttribute & RequiredAttribute;
  };
}

export interface FachkombinationFach extends ComponentSchema {
  info: {
    displayName: 'Fach';
    icon: 'archive';
    description: '';
  };
  attributes: {
    fach: EnumerationAttribute<
      ['Informatik', 'Physik', 'Technomathe', 'Mathe']
    > &
      RequiredAttribute;
  };
}

export interface FachkombinationLehramt extends ComponentSchema {
  info: {
    displayName: 'Lehramt';
    icon: 'bullseye';
    description: '';
  };
  attributes: {
    zweitfach: ComponentAttribute<'fachkombination.fach'> & RequiredAttribute;
    schultyp: EnumerationAttribute<['Gymnasium']> &
      RequiredAttribute &
      DefaultTo<'Gymnasium'>;
  };
}

export interface SprechstundenSprechstundentag extends ComponentSchema {
  info: {
    displayName: 'Sprechstundentag';
    icon: 'audio-description';
  };
  attributes: {
    slot0: ComponentAttribute<'sprechstunden.stunde', true>;
    slot1: ComponentAttribute<'sprechstunden.stunde', true>;
    slot2: ComponentAttribute<'sprechstunden.stunde', true>;
  };
}

export interface SprechstundenStunde extends ComponentSchema {
  info: {
    displayName: 'Stunde';
    icon: 'clock';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
  };
}

export interface UniKinoGenre extends ComponentSchema {
  info: {
    displayName: 'genre';
    icon: 'bezier-curve';
    description: '';
  };
  attributes: {
    genre: EnumerationAttribute<
      [
        'Krimi',
        'Thriller',
        'Tragikom\u00F6die',
        'Kriegssatire',
        'Drama',
        'Kriegsfilm'
      ]
    > &
      RequiredAttribute;
  };
}

export interface UniKinoOrte extends ComponentSchema {
  info: {
    displayName: 'orte';
    icon: 'globe-africa';
  };
  attributes: {
    laender: EnumerationAttribute<['USA', 'UK']> & RequiredAttribute;
  };
}

export interface UniSemester extends ComponentSchema {
  info: {
    displayName: 'Semester';
    icon: 'address-card';
  };
  attributes: {
    Semester: EnumerationAttribute<['WiSe', 'SoSe']> &
      RequiredAttribute &
      DefaultTo<'WiSe'>;
    Jahr: IntegerAttribute & RequiredAttribute & DefaultTo<2000>;
  };
}

export interface VertreterComponentsPositionEnum extends ComponentSchema {
  info: {
    displayName: 'positionEnum';
    icon: 'battery-full';
  };
  attributes: {
    enum: EnumerationAttribute<
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
      RequiredAttribute;
    text: StringAttribute & RequiredAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::einstellungen.einstellungen': ApiEinstellungenEinstellungen;
      'api::feriensprechstunden.feriensprechstunden': ApiFeriensprechstundenFeriensprechstunden;
      'api::sprechstunden.sprechstunden': ApiSprechstundenSprechstunden;
      'api::uni-kino-filme.uni-kino-filme': ApiUniKinoFilmeUniKinoFilme;
      'api::vertreter.vertreter': ApiVertreterVertreter;
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
