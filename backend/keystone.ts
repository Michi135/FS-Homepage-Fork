import { config, list } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session'
import { text, select, integer, image, relationship, timestamp, password } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document'
import { createAuth } from '@keystone-6/auth'

const { withAuth } = createAuth({
    // Required options
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
  
    // Additional options
    sessionData: 'id name email',
    initFirstItem: {
      fields: ['email', 'password'],
      itemData: { 'name': 'Fachschaft' },
      skipKeystoneWelcome: false,
    },
  });

type Session = {
    data: {
        id: string;
        name: string;
    }
}

//TODO: secret with env variable
const session = statelessSessions({
    maxAge: 60 * 30,
    secret: '-- EXAMPLE COOKIE SECRET; CHANGE ME --',
    sameSite: 'strict',
});

const authentic = ({ session }: { session: Session }) => session?.data.name === 'Fachschaft';

const stdPermissions = {
    access: {
        operation: {
            query: () => true,
            create: authentic,
            update: authentic,
            delete: authentic,
        }
    }
}

const course_options = 
[
    {
        label: "Informatik",
        value: "COMPUTER SCIENCE"
    },
    {
        label: "Physik",
        value: "PHYSICS"
    },
    {
        label: "Technomathe",
        value: "TECHNO MATH"
    },
    {
        label: "Mathe",
        value: "MATH"
    }
]

export default withAuth({
    server: {
        port: 4000,
        cors: true
    },
    db: {
        provider: 'postgresql',
        url: 'postgres://postgres:asdf@localhost/keystone', 
    },
    lists: {
        User: list({
          ...stdPermissions,
          fields: {
            name: text(
            { 
                validation: { isRequired: true } 
            }),
            email: text(
            { 
                validation: { isRequired: true }, 
                isIndexed: 'unique' 
            }),
            password: password({
                validation: { 
                    isRequired: false,
                    length: { min: 15, max: 50 },
                    rejectCommon: true
                },
            })
          },
        }),
        Vertreter: list({
            ...stdPermissions,
            fields: {
                nutzer_email: relationship(
                {   
                    ref: "User",
                    db: { foreignKey: { map: 'user_fk' } },
                }),
                rolle: select(
                {
                    validation: { isRequired: true },
                    options: 
                    [
                        {
                            label: "Chef",
                            value: "HEAD",
                        },
                        {
                            label: "Vize",
                            value: "VICE"
                        },
                        {
                            label: "Finanzen",
                            value: "FINANCES"
                        },
                        {
                            label: "Vernetzung",
                            value: "NETWORKING"
                        },
                        {
                            label: "Uni-Kino",
                            value: "UNI-CINEMA"
                        },
                        {
                            label: "Öffentlichkeitsarbeit",
                            value: "PUBLIC RELATIONS"
                        },
                        {
                            label: "Bierkoordination",
                            value: "BEER COORDINATION"
                        },
                        {
                            label: "Physikerbar",
                            value: "PHYSICIST BAR"
                        },
                        {
                            label: "Grafiken",
                            value: "GRAPHICS"
                        },
                        {
                            label: "Skripten",
                            value: "SCRIPTS"
                        },
                        {
                            label: "Root",
                            value: "ROOT"
                        }
                    ]
                }),
                grad: select(
                { 
                    validation: { isRequired: true },
                    defaultValue: "BACHELOR",
                    options: 
                    [
                        {
                            label: "Bachelor",
                            value: "BACHELOR"
                        },
                        {
                            label: "Master",
                            value: "MASTER"
                        }
                    ],
                    db: { map: 'degree' }
                }),
                feld: select(
                { 
                    validation: { isRequired: true }, 
                    defaultValue: "SCIENCE",
                    options: 
                    [
                        {
                            label: "Science",
                            value: "SCIENCE"
                        }
                    ],
                    db: { map: 'field' }
                }),
                hauptfach: select(
                { 
                    validation: { isRequired: true },
                    options: course_options,
                    db: { map: 'primary_course' }
                    
                }),
                zweitfach: select(
                { 
                    validation: { isRequired: false },
                    options: course_options,
                    db: { map: 'secondary_course' }
                }),
                Lehramt: select(
                { 
                    validation: { isRequired: false},
                    options:
                    [
                        {
                            label: "Gymnasium",
                            value: "GYMNASIUM"
                        }
                    ],
                    db: { map: 'lectureship' }
                }),
                semester: integer(
                { 
                    validation: { isRequired: true, min: 1 } 
                }),
                portrait: image({})
            }
        }),
        feriensprechstunden: list({
            ...stdPermissions,
            fields: {
                tag: timestamp({
                    db: { map: 'day' },
                    validation: { isRequired: true },
                    isIndexed: 'unique'
                }),
                person: relationship({
                    ref: 'User',
                    many: true
                })
            }
        }),
        Post: list({
            ...stdPermissions,
            fields: {
              content: document({
                formatting: true,
                dividers: true,
                links: true,
                layouts: [
                  [1, 1],
                  [1, 1, 1],
                ],
              }),
            },
        }),
        /*global: list({
            ...stdPermissions,
            fields: {
                FS_Passwort: password({
                  db: { map: }  
                }) 
            }
        })*/
    },
    images: {
        upload: 'local',
        local: {
            storagePath: 'public/images',
            baseUrl: '/images'
        }
    },
    experimental: {
        generateNodeAPI: true
    },
    session
})