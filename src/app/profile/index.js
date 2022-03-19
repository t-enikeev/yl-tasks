import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../components/layout";
import Header from "../../containers/header";
import Spinner from "../../components/spinner";
import LayoutHeader from "../../components/layout-header";
import { Form, Button, Input, Upload } from "antd";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import ProfileForm from "../../components/profile-form";
import moment from "moment";
import useInit from "../../utils/use-init";

function Profile() {
  const store = useStore();
  useInit(async () => {
    store.countries.load();
    store.cities.load();
  });

  const select = useSelector((state) => ({
    profile: state.session.user?.profile,
    countries: state.countries.items,
    cities: state.cities.items,
  }));

  const profile = {
    name: select.profile?.name,
    surname: select.profile?.surname,
    middlename: select.profile?.middlename,
    phone: select.profile?.phone,
    birthday: select.profile?.birthday ? moment(select.profile?.birthday) : moment(),
    country: select.profile?.country?._id,
    city: select.profile?.city?._id,
  };

  const callbacks = {
    handleSubmit: (data) => {
      const normData = {
        ...data,
        country: { _id: data.country },
        city: { _id: data.city },
      };
      store.session.updateProfile({ profile: normData });
    },
    handleUpload: (e) => {
      store.session.uploadFile(e);
    },
  };

  return (
    <Layout
      head={
        <LayoutHeader>
          <h1>{"Профиль"}</h1>
        </LayoutHeader>
      }
    >
      <Header />
      <ProfileForm
        profile={profile}
        handleSubmit={callbacks.handleSubmit}
        countries={select.countries}
        cities={select.cities}
      />
    </Layout>
  );
}

export default React.memo(Profile);
