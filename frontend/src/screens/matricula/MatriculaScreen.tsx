import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { alunosService } from '../../services/alunos.service';
import { CreateAlunoPayload } from '../../types';
import { isMenorDeIdade } from '../../utils/idade';
import matriculaImg from '../../assets/matricula.png';
import logo from '../../assets/logo.png';

export function MatriculaScreen() {
  const [sucesso, setSucesso] = useState<{ nome: string } | null>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateAlunoPayload>();

  const dataNascimento = watch('dataNascimento');
  const menorDeIdade = isMenorDeIdade(dataNascimento);

  async function onSubmit(data: CreateAlunoPayload) {
    setErro('');
    setLoading(true);
    try {
      const aluno = await alunosService.matricular(data);
      setSucesso({ nome: aluno.nomeCompleto });
      reset();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f0f1a', fontFamily: 'system-ui, sans-serif', padding: '1.5rem',
    }}>
      <div style={{
        display: 'flex', width: '100%', maxWidth: 900, minHeight: 520, maxHeight: '92vh',
        background: '#fff', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Painel esquerdo */}
      {/* Painel esquerdo */}
<div
  style={{
    flex: 1,
    position: 'relative',
    display: 'block',
    backgroundImage: `url(${matriculaImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
 
/>

        {/* Painel direito — conteúdo */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '2.5rem', gap: 20, minWidth: 360, overflowY: 'auto',
        }}>
          <img
            src={logo}
            alt="SOAR"
            style={{ height: 50, objectFit: 'contain' }}
          />
          {sucesso ? (
            <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: 8, padding: '1.5rem',
              }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  ⏳ Matrícula enviada!
                </div>
                <p style={{ fontSize: 14 }}>
                  A matrícula de <strong>{sucesso.nome}</strong> foi recebida e está em análise pela
                  nossa equipe. Você será notificado quando ela for avaliada.
                </p>
                <button
                  onClick={() => setSucesso(null)}
                  style={{ marginTop: 16, padding: '0.5rem 1rem', borderRadius: 24,
                    background: '#1a1a2e', color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: 700 }}
                >
                  Nova matrícula
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Matrícula Online</h1>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  Preencha os dados do aluno e do responsável. Campos com * são obrigatórios.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: 360, display: 'grid', gap: 18 }}>
                <Section title="Dados do Aluno">
                  <Field label="Nome completo *" error={errors.nomeCompleto?.message}>
                    <input {...register('nomeCompleto', { required: 'Obrigatório' })} style={inputStyle} />
                  </Field>
                  <Field label="Data de nascimento *" error={errors.dataNascimento?.message}>
                    <input type="date" {...register('dataNascimento', { required: 'Obrigatório' })} style={inputStyle} />
                  </Field>
                  <Field label="Instrumento desejado">
                    <select {...register('instrumentoDesejado')} style={inputStyle}>
                      <option value="">Selecione...</option>
                      <option value="violão">Violão</option>
                      <option value="percussão">Percussão</option>
                      <option value="acordeon">Acordeon</option>
                      <option value="canto">Canto</option>
                    </select>
                  </Field>
                  <Field label="Horário preferencial">
                    <select {...register('horarioPreferencial')} style={inputStyle}>
                      <option value="">Selecione...</option>
                      <option value="16h">16h</option>
                      <option value="17h">17h</option>
                      <option value="18h">18h</option>
                      <option value="19h">19h</option>
                    </select>
                  </Field>
                </Section>

                <Section title={menorDeIdade ? 'Dados do Responsável Legal' : 'Dados de Contato'}>
                  {menorDeIdade && (
                    <Field label="Nome do responsável *" error={errors.nomeResponsavel?.message}>
                      <input {...register('nomeResponsavel', { required: 'Obrigatório' })} style={inputStyle} />
                    </Field>
                  )}
                  <Field label={menorDeIdade ? 'CPF do responsável *' : 'Seu CPF *'} error={errors.cpfResponsavel?.message}>
                    <input
                      placeholder="000.000.000-00"
                      {...register('cpfResponsavel', {
                        required: 'Obrigatório',
                        pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'Formato: 000.000.000-00' },
                      })}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label={menorDeIdade ? 'Telefone do responsável *' : 'Seu telefone *'} error={errors.telefoneResponsavel?.message}>
                    <input placeholder="(88) 99999-9999" {...register('telefoneResponsavel', { required: 'Obrigatório' })} style={inputStyle} />
                  </Field>
                  <Field label="E-mail (opcional)">
                    <input type="email" {...register('email')} style={inputStyle} />
                  </Field>
                </Section>

                {/* Trava LGPD — obrigatória */}
                <div style={{
                  background: '#fffbeb', border: '1px solid #fcd34d',
                  borderRadius: 8, padding: '1rem',
                }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      {...register('termoLgpdAssinado', { required: 'O aceite do termo é obrigatório' })}
                      style={{ marginTop: 3 }}
                    />
                    <span style={{ fontSize: 12, lineHeight: 1.5 }}>
                      <strong>Termo LGPD (Lei 13.709/2018):</strong>{' '}
                      {menorDeIdade
                        ? 'Declaro que li e autorizo a coleta e tratamento dos dados pessoais do menor acima identificado, para finalidades exclusivas de gestão pedagógica do Instituto Carrascal, conforme a Lei Geral de Proteção de Dados.'
                        : 'Declaro que li e autorizo a coleta e tratamento dos meus dados pessoais, para finalidades exclusivas de gestão pedagógica do Instituto Carrascal, conforme a Lei Geral de Proteção de Dados.'}
                    </span>
                  </label>
                  {errors.termoLgpdAssinado && (
                    <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>
                      {errors.termoLgpdAssinado.message}
                    </p>
                  )}
                </div>

                {erro && (
                  <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.6rem 0.75rem',
                    color: '#dc2626', fontSize: 13 }}>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem', borderRadius: 24, border: 'none',
                    background: loading ? '#9ca3af' : '#1a1a2e', color: '#fff',
                    fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Enviando...' : 'Realizar Matrícula'}
                </button>
              </form>
            </>
          )}

          <Link
            to="/login"
            style={{
              textAlign: 'center', fontSize: 13, color: '#2563eb',
              textDecoration: 'none', fontWeight: 600,
            }}
          >
            Já tenho login, entrar
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .matricula-image-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 14, boxSizing: 'border-box',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ fontSize: 12, fontWeight: 700, color: '#6b7280',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
