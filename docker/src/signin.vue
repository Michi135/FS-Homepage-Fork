<template>
  <div class="signin" data-test="signin">
    <div class="signin-header">
      <div class="title">{{ header.title }}</div>
      <div v-if="header.subTitle" class="sub-title">{{ header.subTitle }}</div>
    </div>
    <factor-spinner v-if="authLoading" />
    <factor-form v-else ref="signin-form">
      <transition-group name="form-inputs">
        <template v-if="view == 'forgot-password'">
          <dashboard-input
            key="email-input"
            v-model="form.email"
            data-test="input-password-email"
            input="factor-input-email"
            required
            placeholder="Email"
            @keyup.enter="trigger('forgot-password')"
          />
          <div key="action-btn" class="action">
            <factor-btn
              ref="forgot-password"
              :loading="loading"
              btn="primary"
              data-test="send-password-email"
              text="Sende Passwort Zurücksetzungsmail"
              @click="
                send({ action: sendPasswordResetEmail, next: `password-email-sent` })
              "
            />
          </div>
        </template>

        <template v-else-if="view == 'reset-password'">
          <dashboard-input
            key="password"
            v-model="form.password"
            input="factor-input-password"
            data-test="reset-password"
            autocomplete="new-password"
            required
            placeholder="Passwort"
            @keyup.enter="trigger('reset-password')"
          />
          <factor-btn
            key="reset-password-btn"
            ref="reset-password"
            btn="primary"
            :loading="loading"
            text="Passwort zurücksetzen"
            @click="
              send({ action: verifyAndResetPassword, next: `successful-password-reset` })
            "
          />
        </template>

        <template v-else-if="!view && isLoggedIn()">
          <div key="action-btn" class="action">
            <factor-link
              btn="primary"
              text="Account Einstellungen"
              path="/dashboard/account"
            />
          </div>
        </template>

        <!-- Neuer Nutzer -->
        <template v-else-if="!view && !newAccount">
          <dashboard-input
            key="email-input"
            v-model="form.email"
            input="factor-input-email"
            data-test="signin-email"
            required
            placeholder="Email"
            @keyup.enter="trigger('submit')"
          />
          <dashboard-input
            key="password-input"
            v-model="form.password"
            input="factor-input-password"
            data-test="signin-password"
            :autocomplete="newAccount ? `new-password` : `current-password`"
            required
            placeholder="Passwort"
            @keyup.enter="trigger('submit')"
          />

          <div key="action-btn" class="action">
            <factor-btn
              ref="submit"
              data-test="submit-login"
              :loading="loading"
              btn="primary"
              @click="signIn('email')"
              >{{ newAccount ? "Registrieren" : "Einloggen" }} &rarr;</factor-btn
            >
          </div>
        </template>
      </transition-group>
    </factor-form>

    <div class="alt-links">
      <template v-if="!isLoggedIn()">
        <div v-if="newAccount && !view" class="forgot-password alternative-action-link">
          Du hast einen Account?
          <a href="#" data-test="link-login" @click.prevent="setNewAccount(false)"
            >Einloggen.</a
          >
        </div>

        <div v-else-if="!view" class="new-account alternative-action-link">
          Kein Account?
          <a href="#" data-test="link-register" @click.prevent="setNewAccount(true)"
            >[Registrieren]</a
          >
        </div>
      </template>

      <template v-if="!isLoggedIn()">
        <template v-if="view">
          <div class="alternative-action-link">
            <a data-test="link-back" @click.prevent="setView()"
              >&larr; Zurück zum Einloggen</a
            >
          </div>
        </template>
        <template v-else-if="!newAccount">
          <div class="forgot-password alternative-action-link">
            Hast du
            <a
              data-test="link-forgot-password"
              @click.prevent="setView(`forgot-password`)"
              >dein Passwort vergessen?</a
            >
          </div>
        </template>
      </template>
      <div v-else-if="!view" class="forgot-password alternative-action-link">
        In anderen Account einloggen?
        <a @click="logout()">Ausloggen&nbsp;&rarr;</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { logout } from "@factor/user/util"
import {
  dashboardInput,
  factorForm,
  factorBtn,
  factorLink,
  factorSpinner,
} from "@factor/ui"
import { waitFor } from "@factor/api"

import { authenticate, userInitialized, isLoggedIn } from "@factor/user"
import {
  sendPasswordResetEmail,
  verifyAndResetPassword,
} from "@factor/user/email-request"

import { CurrentUserState } from "@factor/user/types"
import { notifySignedIn } from "@factor/plugin-standard-signin"
export default {
  components: { factorForm, factorBtn, dashboardInput, factorLink, factorSpinner },
  props: {
    format: { type: String, default: "page" },
    redirect: { type: String, default: "" },
    initialView: { type: String, default: "" },
  },
  data() {
    return {
      loading: false,
      form: {},
      authLoading: true,
      user: undefined,
    }
  },
  computed: {
    header(this: any) {
      if (this.view == "account-created") {
        return {
          title: "Account erstellt",
          subTitle:
            "Gut gemacht. Überprüfe deine Email zum bestätigen deiner Email-Adresse.",
        }
      } else if (this.view == "password-email-sent") {
        return {
          title: "Zurücksetzungsmail gesendet",
          subTitle: "Überprüfe deinen Maileingang.",
        }
      } else if (this.view == "successful-password-reset") {
        return {
          title: "Passwort geändert",
          subTitle: "Du hast erfolgreich dein Passwort geändert.",
        }
      } else if (this.view == "forgot-password") {
        return {
          title: "Passwort zurücksetzen",
          subTitle: "Gib deine Email Adresse an.",
        }
      } else if (this.view == "reset-password") {
        return {
          title: "Neues Password eingeben",
          subTitle: "Gib dein neues Passwort ein.",
        }
      } else if (isLoggedIn()) {
        return {
          title: "Du bist bereits eingeloggt",
        }
      } else if (this.newAccount) {
        return {
          title: "Registrieren",
          subTitle: "Kontaktiere den Admin",
        }
      } else {
        return {
          title: "Einloggen",
          subTitle: "Logge dich in deinen Account ein.",
        }
      }
    },
    view(this: any) {
      return this.$route.query.view || ""
    },
    mode(this: any) {
      return this.$route.query.mode || "continue"
    },
    newAccount(this: any) {
      const isNew =
        typeof this.$route.query.new != "undefined" && this.$route.query.new == "no"
          ? false
          : true
      return isNew
    },
    redirectPath(this: any) {
      return this.redirect ? this.redirect : this.$route.query.redirect || "/"
    },
  },
  created(this: any) {
    const { email, displayName } = this.$route.query

    if (email) {
      this.$set(this.form, "email", email)
    }
    if (displayName) {
      this.$set(this.form, "displayName", displayName)
    }

    if (this.initialView) {
      this.setView(this.initialView)
    }
  },
  async mounted() {
    await userInitialized()

    setTimeout(() => {
      this.authLoading = false
    }, 200)
  },
  methods: {
    sendPasswordResetEmail,
    verifyAndResetPassword,
    isLoggedIn,
    logout,
    setNewAccount(val: boolean) {
      this.$router.replace({
        query: { ...this.$route.query, new: val ? "yes" : "no" },
      })
    },
    trigger(this: any, ref: string) {
      this.$refs[ref].$el.focus()
      this.$refs[ref].$el.click()
    },
    async send(
      this: any,
      {
        action,
        next,
      }: { action: (args: Record<string, any>) => Promise<any>; next: string }
    ) {
      const r = this.$refs["signin-form"].$el.reportValidity()

      if (!r) return

      this.loading = true

      const args = { ...this.form, ...this.$route.query }

      try {
        await action(args)
        this.setView(next)
      } catch {
        this.loading = false
      }

      this.loading = false
    },

    async signIn(this: any) {
      this.errors = []

      const r = this.$refs["signin-form"].$el.reportValidity()

      if (!r) return

      this.loading = true
      let user
      try {
        user = await authenticate({ ...this.form, newAccount: this.newAccount })
      } catch {
        this.loading = false
      }

      if (user) {
        this.user = user
        this.success(user)
      }

      this.loading = false
    },

    /**
     * Set to null to remove from query
     */
    setView(this: any, view?: string | null) {
      const query = { ...this.$route.query, view }

      if (!view) {
        delete query.view
      }

      if (query != this.$route.query) {
        this.$router.replace({ query })
      }
    },

    done(this: any) {
      this.$emit("done")
      if (this.format != "modal") {
        this.setView()
      }
    },

    notifySignedIn(this: any) {
      /**
       * If inside a modal then the modal handles notification
       * Because it needs to track close events
       */
      if (this.format != "modal") {
        notifySignedIn()
      }
    },

    success(this: any) {
      const newAccount = this.newAccount

      if (this.redirectPath) {
        userInitialized(async (user: CurrentUserState) => {
          if (user && user._id && this.redirectPath) {
            await this.$router.push({ path: this.redirectPath })

            waitFor(1000)
          }
        })
      } else {
        this.notifySignedIn()
        if (newAccount) {
          this.setView("account-created")
        } else {
          this.done()
        }
      }
    },
  },
}
</script>

<style lang="less">
.signin {
  font-family: var(
    --font-family-primary,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    Helvetica Neue,
    sans-serif;
  );
  color: var(--color-text, #3a4854);
  a {
    color: var(--color-primary, #0471ff);
  }
  margin: 1em auto 1em;
  width: 300px;
  text-align: center;

  .form-inputs-move {
    transition: transform 1s;
  }
  .form-inputs-leave-active {
    position: absolute;
  }
  .form-inputs-enter-active,
  .form-inputs-leave-active {
    transition: all 1s;
  }
  .form-inputs-enter, .form-inputs-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(30px);
  }
  form {
    font-size: 1.2em;
    input {
      width: 100%;
      max-width: 350px;
    }
  }
  .signin-header {
    margin-bottom: 1.5em;
    .title {
      font-size: 1.8em;
      letter-spacing: -0.02em;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 0.5rem;
    }
    .sub-title {
      font-weight: 500;
      opacity: 0.7;
    }
  }
  .alt-links {
    margin-top: 2em;
    text-align: center;
    font-weight: 500;

    line-height: 1.8;
    a {
      cursor: pointer;
    }
  }

  .sep {
    position: relative;
    margin: 1em 0;
    text-align: center;

    font-style: italic;
    .text {
      opacity: 0.4;
      padding: 0 1em;
      //  background: #fff;
      z-index: 10;
      position: relative;
    }
  }
  .action {
    margin-top: 1em;
  }

  .image-organizer {
    justify-content: center;
  }
}
.modal-content {
  .signin {
    color: inherit;
    input,
    textarea,
    select {
      color: inherit;
    }
  }
}
</style>
