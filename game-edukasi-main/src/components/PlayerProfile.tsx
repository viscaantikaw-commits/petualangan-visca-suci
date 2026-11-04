function PlayerProfile() {
  return (
    <section className="player-profile" aria-label="Profil pemain">
      <div className="player-profile__avatar" aria-hidden="true">
        <span>R</span>
      </div>
      <div className="player-profile__details">
        <span className="player-profile__eyebrow">Siswa</span>
        <strong>Rizki</strong>
        <div
          className="player-profile__progress"
          role="progressbar"
          aria-label="Kemajuan menuju level berikutnya"
          aria-valuenow={62}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span />
        </div>
        <span className="player-profile__level">Level 3</span>
      </div>
    </section>
  )
}

export default PlayerProfile
