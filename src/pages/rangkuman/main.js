import { setupPage } from '../../core/page-setup.js';
import data from '../../data/rangkuman.json';
import credits from '../../data/credits.json';
import './rangkuman.css';

setupPage();

const $ = (id) => document.getElementById(id);

function element(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function table(head, rows) {
  return element('div', { className: 'table-wrap' }, [
    element('table', { className: 'table summary-table' }, [
      element('thead', {}, [element('tr', {}, head.map((text) => element('th', { scope: 'col', textContent: text })))]),
      element('tbody', {}, rows.map(([first, ...rest]) => element('tr', {}, [element('th', { scope: 'row', textContent: first }), ...rest.map((text) => element('td', { textContent: text }))]))),
    ]),
  ]);
}

function cardBody(card) {
  if (card.points) return element('ul', { className: 'summary-card__points' }, card.points.map((text) => element('li', { textContent: text })));
  if (card.groups)
    return element(
      'div',
      { className: 'organel-groups' },
      card.groups.map((group) =>
        element('div', {}, [
          element('p', { className: 'organel-groups__name', textContent: group.name }),
          element('dl', { className: 'organel-groups__list' }, group.items.flatMap(([name, fn]) => [element('dt', { textContent: name }), element('dd', { textContent: fn })])),
        ])
      )
    );
  return table(card.tableHead ?? ['Ciri', 'Sel hewan', 'Sel tumbuhan'], card.table);
}

function renderCards() {
  $('summary-cards').replaceChildren(
    ...data.cards.map((card, index) =>
      element('article', { className: `summary-card summary-card--${index + 1}`, id: card.id }, [
        element('h3', { className: 'summary-card__title', textContent: card.title }),
        cardBody(card),
        element('a', { className: 'text-link', href: `/${card.link.href}`, textContent: `${card.link.label} →` }),
      ])
    )
  );
}

function creditLine(entry) {
  const title = entry.url ? element('a', { href: entry.url, target: '_blank', rel: 'noopener', textContent: entry.judul }) : element('span', { textContent: entry.judul });
  const meta = [entry.pembuat, entry.lisensi].filter(Boolean).join(' · ');
  return element('li', { className: 'credit' }, [
    element('p', { className: 'credit__title' }, [title]),
    element('p', { className: 'credit__meta', textContent: meta }),
    entry.catatan ? element('p', { className: 'note', textContent: entry.catatan }) : '',
  ]);
}

function renderCredits() {
  $('credits').replaceChildren(
    ...data.creditGroups
      .map((group) => ({ group, entries: credits.filter((entry) => group.kategori.includes(entry.kategori)) }))
      .filter(({ entries }) => entries.length)
      .map(({ group, entries }) =>
        element('div', { className: 'credits__group' }, [element('h3', { className: 'credits__title', textContent: group.title }), element('ul', { className: 'credits__list' }, entries.map(creditLine))])
      )
  );
}

function renderTeam() {
  $('members').replaceChildren(
    ...data.members.map(([no, name, role]) =>
      element('tr', {}, [element('td', { className: 'team__no', textContent: no }), element('td', {}, [name, role ? element('span', { className: 'team__role', textContent: ` (${role})` }) : ''])])
    )
  );
  // Baris guru baru tampil setelah namanya diisi di rangkuman.json.
  $('identity').replaceChildren(...data.identity.filter(([, value]) => value).flatMap(([label, value]) => [element('dt', { textContent: label }), element('dd', { textContent: value })]));
}

renderCards();
renderCredits();
renderTeam();
