import { useState } from "react";

import logo from './assets/Isotipo Primario.png'; // Importa tu primera imagen


export const MailSender = () => {
  const [numEquipos, setNumEquipos] = useState("");
  const [numFreeTeams, setNumFreeTeams] = useState("");
  const [matches, setMatches] = useState([]);
  const [freeTeams, setFreeTeams] = useState([]);
  const [matchDay, setMatchDay] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [copySuccess, setCopySuccess] = useState(""); // Para mostrar el mensaje de éxito al copiar

  const handleInputChange = (e) => {
    setNumEquipos(e.target.value);
  };

  const handleInputChangeF = (e) => {
    setNumFreeTeams(e.target.value);
  };

  const handleInputChangeM = (e) => {
    setMatchDay(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchInputs = Array.from({ length: Number(numEquipos) }, () => ({
      teamA: "",
      teamB: "",
    }));
    setMatches(matchInputs);

    const freeTeamInputs = Array.from({ length: Number(numFreeTeams) }, () => ({
      name: "",
    }));
    setFreeTeams(freeTeamInputs);
  };

  const handleMatchChange = (index, field, value) => {
    const updatedMatches = [...matches];
    updatedMatches[index][field] = value;
    setMatches(updatedMatches);
  };

  const handleFreeTeamChange = (index, value) => {
    const updatedFreeTeams = [...freeTeams];
    updatedFreeTeams[index].name = value;
    setFreeTeams(updatedFreeTeams);
  };

  const generateEmails = () => {
    const emails = [];

    matches.forEach((match, index) => {
      emails.push({
        subject: `Coordinación de partido – ${match.teamA} vs ${match.teamB} – Jornada ${matchDay}`,
        body: `Estimados Capitanes de ${match.teamA} y de ${match.teamB},\n\nNos acercamos a la jornada ${matchDay} del campeonato FutCrew, y es necesario coordinar la fecha y hora del partido.\n\nHorarios disponibles:\n- Jueves: 5pm a 9pm\n- Viernes: 5pm a 9pm\n- Sábado: 7am a 2pm / 8pm a 9pm\n\nEs importante que el partido se agende antes del miércoles a las 10pm. Si no se logra, el resultado será 0-0 o, en caso de falta de acuerdo de un solo equipo, la victoria será 5-0 a favor del otro.\n\nAdicionalmente, coordinen los colores de las camisetas para evitar similitudes.\n\nSaludos cordiales.`,
      });
    });

    freeTeams.forEach((team) => {
      emails.push({
        subject: `Notificación de equipo libre – Jornada ${matchDay}`,
        body: `Estimado Capitán de ${team.name},\n\nPor retiro de su rival en etapas tempranas del torneo, se les adjudica la victoria por 5-0 en la jornada ${matchDay}. Por favor, envíen los nombres de 5 jugadores para adjudicar los goles.\n\nSaludos cordiales.`,
      });
    });

    setGeneratedEmails(emails);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess("¡Correo copiado al portapapeles!");
      setTimeout(() => setCopySuccess(""), 2000); // Limpiar el mensaje después de 2 segundos
    }, () => {
      setCopySuccess("Error al copiar");
    });
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo 1" style={{ width: '50px', marginRight: '10px' }} /> 
        <h1 className="d-inline-block">FutCrew Mail Redaction Automation</h1>
        <img src={logo} alt="Logo 2" style={{ width: '50px', marginLeft: '10px' }} />
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Cuántos partidos son"
              value={numEquipos}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Cuántos equipos libres son"
              value={numFreeTeams}
              onChange={handleInputChangeF}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Número de Jornada"
              value={matchDay}
              onChange={handleInputChangeM}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">Agregar Equipos</button>
      </form>

      {matches.map((match, index) => (
        <div key={index} className="mb-3">
          <h3>Partido {index + 1}</h3>
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Equipo A"
                value={match.teamA}
                onChange={(e) => handleMatchChange(index, "teamA", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Equipo B"
                value={match.teamB}
                onChange={(e) => handleMatchChange(index, "teamB", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {freeTeams.map((team, index) => (
        <div key={index} className="mb-3">
          <h3>Equipo Libre {index + 1}</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del equipo libre"
            value={team.name}
            onChange={(e) => handleFreeTeamChange(index, e.target.value)}
          />
        </div>
      ))}

      <button onClick={generateEmails} className="btn btn-success w-100 mt-4">Generar correos</button>

      {generatedEmails.map((email, index) => (
        <div 
          key={index} 
          className="border p-3 mt-3" 
          style={{ maxWidth: '100%', overflowX: 'hidden' }}  // Eliminar scroll horizontal
        >
          <h3>{email.subject}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}> {/* Evitar desbordamiento de texto */}
            {email.body}
          </pre>
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => copyToClipboard(`${email.subject}\n\n${email.body}`)}
          >
            Copiar al portapapeles
          </button>
        </div>
      ))}

      {copySuccess && <div className="alert alert-success mt-3">{copySuccess}</div>}
    </div>
  );
};
