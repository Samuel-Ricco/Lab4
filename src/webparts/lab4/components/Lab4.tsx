import * as React from "react";
import styles from "./Lab4.module.scss";
import { ILab4Props } from "./ILab4Props";

import { Lister } from "../components/Lister";

export default class Lab4 extends React.Component<ILab4Props, {}> {
  public render(): React.ReactElement<ILab4Props> {
    const { hasTeamsContext } = this.props;

    return (
      <section
        className={`${styles.lab4} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <Lister />
      </section>
    );
  }
}
