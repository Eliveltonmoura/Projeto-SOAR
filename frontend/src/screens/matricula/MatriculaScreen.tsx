import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { alunosService } from '../../services/alunos.service';
import { CreateAlunoPayload } from '../../types';

export function MatriculaScreen() {
  const [sucesso, setSucesso] = useState<{ nome: string; status: string } | null>(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateAlunoPayload>();
  const termoAceito = watch('termoLgpdAssinado');

  async function onSubmit(data: CreateAlunoPayload) {
    setErro('');
    setLoading(true);
    try {
      const aluno = await alunosService.matricular(data);
      setSucesso({ nome: aluno.nomeCompleto, status: aluno.status });
      reset();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (sucesso) {
    return (
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Matrícula Online</h1>
        <div style={{
          background: sucesso.status === 'ativo' ? '#d1fae5' : '#fef3c7',
          border: `1px solid ${sucesso.status === 'ativo' ? '#6ee7b7' : '#fcd34d'}`,
          borderRadius: 8, padding: '1.5rem', maxWidth: 480,
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            {sucesso.status === 'ativo' ? '✅ Matrícula realizada!' : '⏳ Adicionado à fila de espera'}
          </div>
          <p>
            <strong>{sucesso.nome}</strong>{' '}
            {sucesso.status === 'ativo'
              ? 'foi matriculado com sucesso.'
              : 'foi adicionado à fila de espera. Você será notificado quando uma vaga abrir.'}
          </p>
          <button
            onClick={() => setSucesso(null)}
            style={{ marginTop: 16, padding: '0.5rem 1rem', borderRadius: 6,
              background: '#1a1a2e', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Nova matrícula
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Matrícula Online</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Preencha os dados do aluno e do responsável. Campos com * são obrigatórios.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 560 }}>
        <Section title="Dados do Aluno">
          <Field label="Nome completo *" error={errors.nomeCompleto?.message}>
            <input {...register('nomeCompleto', { required: 'Obrigatório' })} />
          </Field>
          <Field label="Data de nascimento *" error={errors.dataNascimento?.message}>
            <input type="date" {...register('dataNascimento', { required: 'Obrigatório' })} />
          </Field>
          <Field label="Instrumento desejado">
            <select {...register('instrumentoDesejado')}>
              <option value="">Selecione...</option>
              <option value="violão">Violão</option>
              <option value="percussão">Percussão</option>
              <option value="acordeon">Acordeon</option>
              <option value="canto">Canto</option>
            </select>
          </Field>
          <Field label="Horário preferencial">
            <select {...register('horarioPreferencial')}>
              <option value="">Selecione...</option>
              <option value="16h">16h</option>
              <option value="17h">17h</option>
              <option value="18h">18h</option>
              <option value="19h">19h</option>
            </select>
          </Field>
        </Section>

        <Section title="Dados do Responsável Legal">
          <Field label="Nome do responsável *" error={errors.nomeResponsavel?.message}>
            <input {...register('nomeResponsavel', { required: 'Obrigatório' })} />
          </Field>
          <Field label="CPF do responsável *" error={errors.cpfResponsavel?.message}>
            <input
              placeholder="000.000.000-00"
              {...register('cpfResponsavel', {
                required: 'Obrigatório',
                pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'Formato: 000.000.000-00' },
              })}
            />
          </Field>
          <Field label="Telefone *" error={errors.telefoneResponsavel?.message}>
            <input placeholder="(88) 99999-9999" {...register('telefoneResponsavel', { required: 'Obrigatório' })} />
          </Field>
          <Field label="E-mail (opcional)">
            <input type="email" {...register('email')} />
          </Field>
        </Section>

        {/* Trava LGPD — obrigatória */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fcd34d',
          borderRadius: 8, padding: '1rem', marginBottom: 20,
        }}>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              {...register('termoLgpdAssinado', { required: 'O aceite do termo é obrigatório' })}
              style={{ marginTop: 3 }}
            />
            <span style={{ fontSize: 13, lineHeight: 1.5 }}>
              <strong>Termo LGPD (Lei 13.709/2018):</strong> Declaro que li e autorizo a coleta e
              tratamento dos dados pessoais do menor acima identificado, para finalidades exclusivas
              de gestão pedagógica do Instituto Carrascal, conforme a Lei Geral de Proteção de Dados.
            </span>
          </label>
          {errors.termoLgpdAssinado && (
            <p style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>
              {errors.termoLgpdAssinado.message}
            </p>
          )}
        </div>

        {erro && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: 6, padding: '0.75rem 1rem', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '0.75rem',
            background: loading ? '#9ca3af' : '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Realizar Matrícula'}
        </button>
      </form>
    </div>
  );
}

// Componentes auxiliares para manter o formulário limpo
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280',
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  const inputStyle = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: `1px solid ${error ? '#f87171' : '#d1d5db'}`,
    borderRadius: 6, fontSize: 14, boxSizing: 'border-box' as const,
  };
  return (
    <div>
      <label style={{ fontSize: 13, color: '#374151', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      {/* Injeta estilo no filho */}
      <div style={inputStyle}>
        {children}
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 3 }}>{error}</p>}
    </div>
  );
}
